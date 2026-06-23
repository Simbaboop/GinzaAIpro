"use client";

import { useEffect, useState } from "react";

type Observation = {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  outcome: string;
  decisionNote: string;
  owner: string;
  nextAction: string;
  outcomeStatus: "Open" | "Improving" | "Resolved" | "Escalated";
  createdAt: string;
};

const categories = [
  "Opportunity",
  "Problem",
  "Risk",
  "Revenue",
  "Research",
  "Execution",
  "Customer",
  "Operations",
];
const severities = ["Low", "Medium", "High", "Critical"];

export default function Home() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Opportunity");
  const [severity, setSeverity] = useState("Medium");
  const [owner, setOwner] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("ginzaaipro_observations");

    if (stored) {
      setObservations(JSON.parse(stored));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "ginzaaipro_observations",
      JSON.stringify(observations),
    );
  }, [observations]);

  function addObservation() {
    if (!title.trim() || !description.trim()) return;

    const newObservation: Observation = {
      severity,
      id: crypto.randomUUID(),
      title,
      description,
      category,
      status: "New",
      outcome: "",
      decisionNote: "",
      owner,
      nextAction,
      outcomeStatus: "Open",
      createdAt: new Date().toISOString(),
    };

    setObservations([newObservation, ...observations]);
    setTitle("");
    setDescription("");
    setCategory("Opportunity");
    setSeverity("Medium");
    setOwner("");
    setNextAction("");
  }

  function updateStatus(id: string, status: string) {
    setObservations((current) =>
      current.map((observation) =>
        observation.id === id ? { ...observation, status } : observation,
      ),
    );
  }
  function updateOutcome(id: string, outcome: string) {
    setObservations((current) =>
      current.map((observation) =>
        observation.id === id ? { ...observation, outcome } : observation,
      ),
    );
  }
  function updateDecisionNote(id: string, decisionNote: string) {
    setObservations((current) =>
      current.map((observation) =>
        observation.id === id ? { ...observation, decisionNote } : observation,
      ),
    );
  }
  function updateNextAction(id: string, nextAction: string) {
    setObservations((current) =>
      current.map((observation) =>
        observation.id === id ? { ...observation, nextAction } : observation,
      ),
    );
  }
  function updateOutcomeStatus(
    id: string,
    outcomeStatus: Observation["outcomeStatus"],
  ) {
    setObservations((current) =>
      current.map((observation) =>
        observation.id === id ? { ...observation, outcomeStatus } : observation,
      ),
    );
  }
  function getOutcomeStatusColor(status: Observation["outcomeStatus"]) {
    switch (status) {
      case "Resolved":
        return "text-green-400";

      case "Escalated":
        return "text-red-400";

      case "Improving":
        return "text-blue-400";

      default:
        return "text-slate-400";
    }
  }
  const filteredObservations = observations.filter((observation) => {
    const matchesCategory =
      categoryFilter === "All" || observation.category === categoryFilter;

    const matchesSeverity =
      severityFilter === "All" || observation.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" || observation.status === statusFilter;
    const normalizedSearch = searchQuery.toLowerCase();

    const matchesSearch =
      normalizedSearch === "" ||
      observation.title.toLowerCase().includes(normalizedSearch) ||
      observation.description.toLowerCase().includes(normalizedSearch) ||
      (observation.outcome ?? "").toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10">
          <p className="text-sm tracking-[0.3em] text-slate-400">GinzaAIpro</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Operational Intelligence Workbench
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Capture observations, classify operational reality, govern
            decisions, and convert insight into controlled execution.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Capture Observation</h2>
            <p className="mt-2 text-sm text-slate-400">
              Record something noticed, discovered, reported, or inferred.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-300">Title</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Example: Missed follow-up on moving lead"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Description</label>
                <textarea
                  className="mt-2 min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe what happened and why it matters."
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Category</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Severity</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value)}
                >
                  {severities.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Next Action</label>

                <input
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
                  value={nextAction}
                  onChange={(event) => setNextAction(event.target.value)}
                  placeholder="Smallest next step to move this forward..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Owner</label>

                <input
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
                  value={owner}
                  onChange={(event) => setOwner(event.target.value)}
                  placeholder="Person, team, role, or agent responsible..."
                />
              </div>

              <button
                onClick={addObservation}
                className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-200"
              >
                Save Observation
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Observation Registry</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Captured operational signals stored in browser storage.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                  Total: {observations.length}
                </div>

                <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-red-300">
                  Critical:{" "}
                  {observations.filter((o) => o.severity === "Critical").length}
                </div>

                <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-orange-300">
                  High:{" "}
                  {observations.filter((o) => o.severity === "High").length}
                </div>

                <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-blue-300">
                  Open:{" "}
                  {
                    observations.filter(
                      (o) => o.status !== "Resolved" && o.status !== "Archived",
                    ).length
                  }
                </div>
              </div>
            </div>
            <div className="mt-6">
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
                placeholder="Search observations..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <select
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option>All</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                value={severityFilter}
                onChange={(event) => setSeverityFilter(event.target.value)}
              >
                <option>All</option>
                {severities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option>All</option>
                <option>New</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Archived</option>
              </select>
            </div>

            <div className="mt-6 space-y-4">
              {filteredObservations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                  No observations captured yet.
                </div>
              ) : (
                filteredObservations.map((observation) => (
                  <div
                    key={observation.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {observation.category} ·{" "}
                          {observation.severity ?? "Medium"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Owner: {observation.owner || "Unassigned"}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">
                          {observation.title}
                        </h3>
                      </div>

                      <select
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                        value={observation.status}
                        onChange={(event) =>
                          updateStatus(observation.id, event.target.value)
                        }
                      >
                        <option>New</option>
                        <option>Under Review</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Archived</option>
                      </select>
                    </div>

                    <p className="mt-4 text-sm text-slate-300">
                      {observation.description}
                    </p>

                    <div className="mt-4 space-y-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Outcome Status
                        </label>

                        <select
                          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
                          value={observation.outcomeStatus}
                          onChange={(event) =>
                            updateOutcomeStatus(
                              observation.id,
                              event.target
                                .value as Observation["outcomeStatus"],
                            )
                          }
                        >
                          <option>Open</option>
                          <option>Improving</option>
                          <option>Resolved</option>
                          <option>Escalated</option>
                        </select>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Next Action
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {observation.nextAction || "No next action defined"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Outcome Status
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {observation.outcomeStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Outcome / Learning
                      </label>

                      <textarea
                        className="mt-2 min-h-24 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
                        value={observation.outcome ?? ""}
                        onChange={(event) =>
                          updateOutcome(observation.id, event.target.value)
                        }
                        placeholder="Record what happened next, what was learned, or what decision resulted."
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Decision Note
                      </label>

                      <textarea
                        className="mt-2 min-h-24 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
                        value={observation.decisionNote ?? ""}
                        onChange={(event) =>
                          updateDecisionNote(observation.id, event.target.value)
                        }
                        placeholder="Record approvals, rejections, rationale, owners, review dates, or governance decisions."
                      />
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      Captured:{" "}
                      {new Date(observation.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
