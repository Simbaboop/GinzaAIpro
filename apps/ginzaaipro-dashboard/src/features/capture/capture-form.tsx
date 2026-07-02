"use client";

import { useState } from "react";

import { CaptureService } from "./capture.service";
import type { CaptureRecord, CaptureSource } from "./capture.types";

const sources: CaptureSource[] = [
  "Phone",
  "Email",
  "SMS",
  "Website",
  "Walk-In",
  "Manual",
];

export function CaptureForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<CaptureSource>("Manual");

  const service = new CaptureService();

  function handleCapture() {
    const record: CaptureRecord = {
      id: crypto.randomUUID(),
      title,
      description,
      source,
      capturedAt: new Date().toISOString(),
    };

    const evidence = service.toEvidence(record);

    console.log("Captured evidence:", evidence);

    setTitle("");
    setDescription("");
    setSource("Manual");
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-slate-100">
        Capture Operational Evidence
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Record operational reality as structured evidence.
      </p>

      <div className="mt-6 space-y-4">
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <select
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          value={source}
          onChange={(event) => setSource(event.target.value as CaptureSource)}
        >
          {sources.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950"
          type="button"
          onClick={handleCapture}
        >
          Capture Evidence
        </button>
      </div>
    </section>
  );
}
