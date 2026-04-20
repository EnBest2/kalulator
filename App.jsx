import React, { useEffect, useState } from "react";
import { initDB, saveProject, getProjects, deleteProject } from "./db.js";
import {
  calcMaterialCost,
  calcEnergyCost,
  calcAmortization,
  calcLabor,
  calcFinalPrice
} from "./calc.js";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    initDB().then(() => {
      setProjects(getProjects());
    });
  }, []);

  function calculate() {
    const hours = +document.getElementById("hours").value;
    const grams = +document.getElementById("grams").value;
    const power = +document.getElementById("power").value;
    const kwh = +document.getElementById("kwh").value;
    const filamentPrice = +document.getElementById("filamentPrice").value;
    const printerPrice = +document.getElementById("printerPrice").value;
    const lifetime = +document.getElementById("lifetime").value;
    const labor = +document.getElementById("labor").value;
    const wage = +document.getElementById("wage").value;
    const errorRate = +document.getElementById("errorRate").value;
    const markup = +document.getElementById("markup").value;

    const material = calcMaterialCost(grams, filamentPrice);
    const energy = calcEnergyCost(hours, power, kwh);
    const amort = calcAmortization(hours, printerPrice, lifetime);
    const laborCost = calcLabor(labor, wage);

    const base = material + energy + amort + laborCost;
    const final = calcFinalPrice(base, errorRate, markup);

    setResult({ material, energy, amort, laborCost, base, final });
  }

  function save() {
    if (!result) return;
    const name = prompt("Projekt neve:");
    if (!name) return;
    saveProject(name, Math.round(result.final));
    setProjects(getProjects());
  }

  function remove(id) {
    deleteProject(id);
    setProjects(getProjects());
  }

  return (
    <>
      <header>
        <h2>3D Nyomtatási Kalkulátor</h2>
      </header>

      <div className="container">
        <h3>Kalkuláció</h3>

        <input id="hours" type="number" defaultValue="3" placeholder="Nyomtatási idő (óra)" />
        <input id="grams" type="number" defaultValue="45" placeholder="Felhasznált anyag (g)" />
        <input id="power" type="number" defaultValue="200" placeholder="Teljesítmény (W)" />
        <input id="kwh" type="number" defaultValue="38" placeholder="Áram ára (Ft/kWh)" />
        <input
          id="filamentPrice"
          type="number"
          defaultValue="7000"
          placeholder="Filament ára (Ft/kg)"
        />
        <input
          id="printerPrice"
          type="number"
          defaultValue="120000"
          placeholder="Nyomtató ára (Ft)"
        />
        <input
          id="lifetime"
          type="number"
          defaultValue="3000"
          placeholder="Nyomtató élettartam (óra)"
        />
        <input id="labor" type="number" defaultValue="20" placeholder="Munkaidő (perc)" />
        <input id="wage" type="number" defaultValue="1500" placeholder="Órabér (Ft/óra)" />
        <input id="errorRate" type="number" defaultValue="10" placeholder="Hibaarány (%)" />
        <input id="markup" type="number" defaultValue="30" placeholder="Haszonkulcs (%)" />

        <button onClick={calculate}>Számítás</button>

        {result && (
          <div className="result">
            <p>Anyagköltség: {result.material.toFixed(0)} Ft</p>
            <p>Áramköltség: {result.energy.toFixed(0)} Ft</p>
            <p>Amortizáció: {result.amort.toFixed(0)} Ft</p>
            <p>Munka: {result.laborCost.toFixed(0)} Ft</p>
            <p>Alap költség: {result.base.toFixed(0)} Ft</p>
            <h3>Végső ár: {result.final.toFixed(0)} Ft</h3>
            <button onClick={save}>Projekt mentése</button>
          </div>
        )}

        <h3>Mentett projektek</h3>
        {projects.map((p) => (
          <div className="item" key={p.id}>
            <span>
              <b>{p.name}</b> — {p.final_price} Ft
            </span>
            <button onClick={() => remove(p.id)}>Törlés</button>
          </div>
        ))}
      </div>
    </>
  );
}
