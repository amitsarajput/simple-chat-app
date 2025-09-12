import { useEffect, useState } from "react";

import { faker } from "@faker-js/faker";
// Import `useMutation` and `api` from Convex.
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
// For demo purposes. In a real app, you'd have real user data.
const NAME = getOrSetFakeName();
const SUBJECT_KEY = "selected_subject";

export default function App() {
  const path = window.location.pathname;

  const [activeTab, setActiveTab] = useState<"physics" | "chemistry" | "maths">(getInitialSubject());

  
  
  // Clear chat_hidden only if user visits /show-chat
  useEffect(() => {
    if (sessionStorage.getItem("chat_hidden")===null) {
      sessionStorage.setItem("chat_hidden", "true");
      setHidden(sessionStorage.getItem("chat_hidden") === "true");
    }
    if (path === "/all-subjects") {
      sessionStorage.setItem("chat_hidden", "false");
      // Redirect back to home after unlocking
      window.location.replace("/");
    }else if (path === "/all-xyz-deleted") {
      sessionStorage.setItem("chat_hidden", "false");
    }else if (path === "/ses"){
      sessionStorage.clear();
      window.location.replace("/");
    }
  }, [path]);
  

  
  const [hidden, setHidden] = useState(isChatHidden());
  //console.log("chat_hidden:", sessionStorage.getItem("chat_hidden"));
  //console.log("hidden state:", hidden);


  const messages = path === "/all-xyz-deleted" ? useQuery(api.chat.getDeletedMessages) : useQuery(api.chat.getMessages);
  // TODO: Add mutation hook here.
  const deleteAllMessages = useMutation(api.chat.deleteAllMessages);

  const sendMessage = useMutation(api.chat.sendMessage);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  const setConversationStatus = useMutation(api.chat.setConversationStatus);
  const chatStatus = useQuery(api.chat.getConversationStatus);



  return (
    <main className="chat">

      {!hidden && chatStatus==="on" ? (
        <>
        <header>
        <h1>Find Your Formula</h1>
        <div className="header-actions">
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete all messages?")) {
                await deleteAllMessages();
              }
            }}
            className="header-button delete-button"
          > Delete All</button>
          <button
            onClick={() => {
              sessionStorage.setItem("chat_hidden", "true");
              window.location.reload(); // Refresh to apply hidden state
            }}
            className="header-button hide-button"
          >
            🙈 Hide
          </button>
          <button
            onClick={async () => {
              await setConversationStatus({ chatStatus: "off" });
              window.location.reload();
            }}
            
            className="header-button hide-permanent"
          >
            🛑 Stop
          </button>

        </div>
        <p>
          Connected as <strong>{NAME}</strong>
        </p>
      </header>

      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.user === NAME ? "message-mine" : ""}
        >
          <div>{message.user}</div>

          <p>{message.body}
          { message.deleted_at? (
            <small><br />{new Date(message.deleted_at).toLocaleString()}</small>
            ) : <small className="msg-time"><br />{new Date(message._creationTime).toLocaleString()}</small>}
          </p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // Replace "alert("Mutation not implemented yet");" with:
          await sendMessage({ user: NAME, body: newMessageText });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
          autoFocus
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
      </>
      ) : (
        <section style={{ padding: "2rem", textAlign: "center" }}>

          <h2 style={{ marginTop: "2rem" }}>📚 Formula Reference</h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }} 
              className="subject-tabs">
            <button
              onClick={() => {
                setActiveTab("physics");
                sessionStorage.setItem(SUBJECT_KEY, "physics");
              }}
              className={activeTab === "physics" ? "active-tab physics" : "physics"}
            >
              Physics
            </button>
            <button
              onClick={() => {
                setActiveTab("chemistry");
                sessionStorage.setItem(SUBJECT_KEY, "chemistry");
              }}
              className={activeTab === "chemistry" ? "active-tab chemistry" : "chemistry"}
            >
              Chemistry
            </button>
            <button
              onClick={() => {
                setActiveTab("maths");
                sessionStorage.setItem(SUBJECT_KEY, "maths");
              }}
              className={activeTab === "maths" ? "active-tab maths" : "maths"}
            >
              Maths
            </button>
          </div>

          <div style={{ textAlign: "left", maxWidth: "700px", margin: "0 auto" }} className="formulas-content">
            {activeTab === "physics" && (
              <div className="physics-formulas">
                <h3>⚡ Electric Charges & Fields</h3>
                <p><strong>Coulomb’s Law:</strong> F = k·q₁·q₂ / r²</p>
                <p><strong>Electric Field:</strong> E = k·Q / r²</p>
                <p><strong>Electric Flux:</strong> Φ = E·A·cosθ</p>
                <p><strong>Gauss’s Law:</strong> Φ = Q / ε₀</p>
                <hr/>
                <h3>🔋 Electrostatic Potential & Capacitance</h3>
                <p><strong>Electric Potential:</strong> V = k·Q / r</p>
                <p><strong>Potential Energy:</strong> U = ½·C·V²</p>
                <p><strong>Capacitance:</strong> C = ε₀·A / d</p>
                <p><strong>Energy Density:</strong> u = ½·ε₀·E²</p>
                <hr/>
                <h3>🔌 Current Electricity</h3>
                <p><strong>Ohm’s Law:</strong> V = I·R</p>
                <p><strong>Power:</strong> P = V·I = I²·R = V²/R</p>
                <p><strong>Resistance:</strong> R = ρ·L / A</p>
                <p><strong>Drift Velocity:</strong> vₐ = I / (n·A·e)</p>
                <hr/>
                <h3>🧲 Magnetism & Moving Charges</h3>
                <p><strong>Magnetic Force:</strong> F = q·(v × B)</p>
                <p><strong>Biot–Savart Law:</strong> B = μ₀·I·d·sinθ / 4π·r²</p>
                <p><strong>Ampere’s Law:</strong> ∮B·dl = μ₀·I</p>
                <p><strong>Torque on Dipole:</strong> τ = p × B</p>
                <hr/>
                <h3>🧲 Magnetism & Matter</h3>
                <p><strong>Magnetic Susceptibility:</strong> χ = M / H</p>
                <p><strong>Magnetic Permeability:</strong> μ = B / H</p>
                <p><strong>Relation:</strong> μ = μ₀(1 + χ)</p>
                <hr/>
                <h3>🌊 Electromagnetic Induction</h3>
                <p><strong>Faraday’s Law:</strong> ε = –dΦ/dt</p>
                <p><strong>Lenz’s Law:</strong> Direction opposes cause</p>
                <p><strong>Self Inductance:</strong> ε = –L·(dI/dt)</p>
                <hr/>
                <h3>🔄 Alternating Current</h3>
                <p><strong>Impedance:</strong> Z = √(R² + (Xₗ – Xc)²)</p>
                <p><strong>Reactance:</strong> Xₗ = ω·L, Xc = 1 / (ω·C)</p>
                <p><strong>Power Factor:</strong> cosθ = R / Z</p>
                <hr/>
                <h3>📡 Electromagnetic Waves</h3>
                <p><strong>Speed of EM Wave:</strong> c = 1 / √(μ₀·ε₀)</p>
                <p><strong>Energy Density:</strong> u = ε₀·E²</p>
                <hr/>
                <h3>🔭 Ray & Wave Optics</h3>
                <p><strong>Lens Formula:</strong> 1/f = 1/v – 1/u</p>
                <p><strong>Magnification:</strong> m = v / u</p>
                <p><strong>Young’s Double Slit:</strong> Δx = λ·D / d</p>
                <p><strong>Diffraction Grating:</strong> d·sinθ = n·λ</p>
                <hr/>
                <h3>🌌 Dual Nature, Atoms & Nuclei</h3>
                <p><strong>de Broglie Wavelength:</strong> λ = h / p</p>
                <p><strong>Energy of Photon:</strong> E = h·ν</p>
                <p><strong>Einstein’s Photoelectric Equation:</strong> h·ν = φ + K.E.</p>
                <p><strong>Mass-Energy Equivalence:</strong> E = mc²</p>
                <hr/>
                <h3>⚛️ Semiconductor Devices</h3>
                <p><strong>Current Gain (CE):</strong> β = I_C / I_B</p>
                <p><strong>Rectifier Efficiency:</strong> η = P_dc / P_ac</p>


              </div>
            )}

            {activeTab === "chemistry" && (
              <div className="chemistry-formulas">
                <h3>🧪 Solutions</h3>
                <p><strong>Molarity:</strong> M = moles of solute / volume of solution (L)</p>
                <p><strong>Molality:</strong> m = moles of solute / mass of solvent (kg)</p>
                <p><strong>Normality:</strong> N = gram equivalent / volume (L)</p>
                <p><strong>Osmotic Pressure:</strong> π = i·C·R·T</p>
                <p><strong>Boiling Point Elevation:</strong> ΔT<sub>b</sub> = K<sub>b</sub>·m</p>
                <p><strong>Freezing Point Depression:</strong> ΔT<sub>f</sub> = K<sub>f</sub>·m</p>
                <hr/>
                <h3>⚗️ Electrochemistry</h3>
                <p><strong>Nernst Equation:</strong> E = E° – (0.0591/n)·logQ</p>
                <p><strong>Gibbs Free Energy:</strong> ΔG = –n·F·E</p>
                <p><strong>Faraday’s Laws:</strong> m = (E·t·M) / (n·F)</p>
                <hr/>
                <h3>⏱️ Chemical Kinetics</h3>
                <p><strong>Rate Law:</strong> Rate = k·[A]^m·[B]^n</p>
                <p><strong>Half-Life (1st Order):</strong> t½ = 0.693 / k</p>
                <p><strong>Arrhenius Equation:</strong> k = A·e^(–Ea/RT)</p>
                <p><strong>Activation Energy:</strong> Ea = –R·slope (from ln k vs 1/T)</p>
                <hr/>
                <h3>🌡️ Thermodynamics</h3>
                <p><strong>First Law:</strong> ΔU = q + W</p>
                <p><strong>Enthalpy:</strong> ΔH = ΔU + P·ΔV</p>
                <p><strong>Entropy:</strong> ΔS = q<sub>rev</sub> / T</p>
                <p><strong>Gibbs Equation:</strong> ΔG = ΔH – T·ΔS</p>
                <hr/>
                <h3>🧬 Organic Chemistry</h3>
                <p><strong>General Formula:</strong> Alkanes: C<sub>n</sub>H<sub>2n+2</sub>, Alkenes: C<sub>n</sub>H<sub>2n</sub>, Alkynes: C<sub>n</sub>H<sub>2n–2</sub></p>
                <p><strong>Alcohol Oxidation:</strong> R–OH → R=O</p>
                <p><strong>SN1/SN2 Mechanisms:</strong> SN1: two-step, SN2: one-step</p>
                <p><strong>IUPAC Naming:</strong> Prefix + Root + Suffix</p>

              </div>
            )}

            {activeTab === "maths" && (
              <div className="maths-formulas">
                <h3>📐 Calculus</h3>
                <p><strong>Second Derivative:</strong> f''(x) = d²f/dx²</p>
                <p><strong>Derivative of eˣ:</strong> d/dx(eˣ) = eˣ</p>
                <p><strong>Derivative of ln(x):</strong> d/dx(ln x) = 1/x</p>
                <p><strong>Derivative of sin(x):</strong> d/dx(sin x) = cos x</p>
                <p><strong>Derivative of cos(x):</strong> d/dx(cos x) = –sin x</p>
                <p><strong>Integration by Parts:</strong> ∫u·v dx = u∫v dx – ∫(du/dx · ∫v dx) dx</p>
                <p><strong>Integration of eˣ:</strong> ∫eˣ dx = eˣ + C</p>
                <p><strong>Integration of sin(x):</strong> ∫sin x dx = –cos x + C</p>
                <p><strong>Integration of cos(x):</strong> ∫cos x dx = sin x + C</p>
                <p><strong>Integration of 1/x:</strong> ∫1/x dx = ln|x| + C</p>
                <hr/>
                <h3>📊 Probability</h3>
                <p><strong>Total Probability Theorem:</strong> P(E) = Σ P(E|Aᵢ)·P(Aᵢ)</p>
                <p><strong>Independent Events:</strong> P(A ∩ B) = P(A)·P(B)</p>
                <p><strong>Complement Rule:</strong> P(A') = 1 – P(A)</p>
                <p><strong>Expected Value:</strong> E(X) = Σ x·P(x)</p>
                <p><strong>Variance:</strong> Var(X) = E(X²) – [E(X)]²</p>
                <hr/>
                <h3>📈 Algebra</h3>
                <p><strong>Sum of n Natural Numbers:</strong> S = n(n + 1)/2</p>
                <p><strong>Sum of Squares:</strong> S = n(n + 1)(2n + 1)/6</p>
                <p><strong>Sum of Cubes:</strong> S = [n(n + 1)/2]²</p>
                <p><strong>Discriminant:</strong> D = b² – 4ac</p>
                <p><strong>Roots of Quadratic:</strong> Real if D ≥ 0, Complex if D Less Than 0</p>
                <hr/>
                <h3>📏 Geometry</h3>
                <p><strong>Midpoint Formula:</strong> M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</p>
                <p><strong>Slope of Line:</strong> m = (y₂ – y₁)/(x₂ – x₁)</p>
                <p><strong>Equation of Line (Point–Slope):</strong> y – y₁ = m(x – x₁)</p>
                <p><strong>General Form:</strong> Ax + By + C = 0</p>
                <p><strong>Area of Triangle:</strong> A = ½·|x₁(y₂ – y₃) + x₂(y₃ – y₁) + x₃(y₁ – y₂)|</p>
                <hr/>
                <h3>🔀 Matrices & Determinants</h3>
                <p><strong>Transpose:</strong> (Aᵗ)<sub>ij</sub> = A<sub>ji</sub></p>
                <p><strong>Symmetric Matrix:</strong> A = Aᵗ</p>
                <p><strong>Skew-Symmetric:</strong> Aᵗ = –A</p>
                <p><strong>Adjoint:</strong> adj(A) = transpose of cofactor matrix</p>
                <p><strong>Determinant (3×3):</strong> Use cofactor expansion</p>
                <p><strong>Inverse Condition:</strong> A⁻¹ exists only if |A| ≠ 0</p>
              </div>
            )}
          </div>
        </section>
      )
      }

    </main>
  );
}

function getOrSetFakeName() {
  const NAME_KEY = "tutorial_name";
  const name = sessionStorage.getItem(NAME_KEY);
  if (!name) {
    const newName = faker.person.firstName();
    sessionStorage.setItem(NAME_KEY, newName);
    return newName;
  }
  return name;
}

function isChatHidden() {
  return sessionStorage.getItem("chat_hidden") === "true";
}

function getInitialSubject(): "physics" | "chemistry" | "maths" {
  const stored = sessionStorage.getItem(SUBJECT_KEY);
  if (stored === "physics" || stored === "chemistry" || stored === "maths") {
    return stored;
  }
  sessionStorage.setItem(SUBJECT_KEY, "physics"); // default
  return "physics";
}


