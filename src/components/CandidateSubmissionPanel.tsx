import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, FileText, Loader2, Paperclip, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

const PROBLEM_TITLE = "Problem 03: Distributed Rate Limiter";

type Submission = {
  id: string;
  candidate_name: string;
  candidate_email: string | null;
  problem_title: string;
  message: string | null;
  resume_name: string | null;
  created_at: string;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-sm border border-border bg-code px-2 py-1.5 font-mono text-[10px] text-code-foreground outline-none placeholder:text-line-number focus:border-ring";

export function CandidateSubmissionPanel() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("Alex Mercer");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submissions = useQuery({
    queryKey: ["candidate-submissions"],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from("candidate_submissions")
        .select(
          "id, candidate_name, candidate_email, problem_title, message, resume_name, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(20);
      if (queryError) throw queryError;
      return (data ?? []) as Submission[];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      let resumePath: string | null = null;
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(path, file, { contentType: file.type || "application/octet-stream" });
        if (uploadError) throw uploadError;
        resumePath = path;
      }
      const { error: insertError } = await supabase.from("candidate_submissions").insert({
        candidate_name: name.trim(),
        candidate_email: email.trim() || null,
        problem_title: PROBLEM_TITLE,
        message: message.trim() || null,
        resume_path: resumePath,
        resume_name: file?.name ?? null,
      });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      setDone(true);
      setError(null);
      setMessage("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["candidate-submissions"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-3 text-[11px]">
        {done ? (
          <section className="panel-box space-y-2">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="size-4" />
              <h2 className="text-xs font-semibold">Submission received</h2>
            </div>
            <p className="text-muted-foreground">
              Thanks, {name.split(" ")[0] || "candidate"}. Your solution and documents are locked in
              for this session.
            </p>
            <ol className="space-y-1.5 font-mono text-[10px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <Clock3 className="mt-0.5 size-3 shrink-0 text-info" />
                <span>Panel review of your code and telemetry — within 48 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <UserRound className="mt-0.5 size-3 shrink-0 text-info" />
                <span>Hiring manager conversation if the panel moves you forward.</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="mt-0.5 size-3 shrink-0 text-info" />
                <span>Written scorecard emailed either way.</span>
              </li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-full text-[10px]"
              onClick={() => setDone(false)}
            >
              Add another document
            </Button>
          </section>
        ) : (
          <section className="panel-box space-y-2">
            <h2 className="section-title">
              <Send />
              Candidate details &amp; resume
            </h2>
            <Field label="Full name">
              <input
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Alex Mercer"
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="alex@company.com"
              />
            </Field>
            <Field label="Note to interviewer">
              <textarea
                className={`${inputClass} h-16 resize-none`}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Trade-offs, assumptions, anything you'd add with more time…"
              />
            </Field>
            <Field label="Resume (PDF / DOC, max 10MB)">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-sm border border-border bg-code px-2 py-1.5 font-mono text-[10px] text-muted-foreground file:mr-2 file:rounded-sm file:border-0 file:bg-panel-raised file:px-2 file:py-0.5 file:text-[10px] file:text-foreground"
              />
            </Field>
            {file ? (
              <p className="flex items-center gap-1 font-mono text-[9px] text-info">
                <Paperclip className="size-3" />
                {file.name}
              </p>
            ) : null}
            {error ? <p className="font-mono text-[9px] text-destructive">{error}</p> : null}
            <Button
              size="sm"
              className="h-7 w-full gap-1 text-[10px]"
              disabled={submit.isPending || name.trim().length === 0}
              onClick={() => submit.mutate()}
            >
              {submit.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Send className="size-3" />
              )}
              {submit.isPending ? "Submitting…" : "Submit final package"}
            </Button>
          </section>
        )}

        <section>
          <h2 className="section-title">
            <FileText />
            Session submissions
          </h2>
          {submissions.isLoading ? (
            <p className="font-mono text-[10px] text-muted-foreground">Loading…</p>
          ) : submissions.data && submissions.data.length > 0 ? (
            <ul className="space-y-1.5">
              {submissions.data.map((row) => (
                <li key={row.id} className="panel-box space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[10px] font-semibold text-foreground">
                      {row.candidate_name}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {new Date(row.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="truncate font-mono text-[9px] text-muted-foreground">
                    {row.problem_title}
                  </p>
                  {row.resume_name ? (
                    <p className="flex items-center gap-1 font-mono text-[9px] text-info">
                      <Paperclip className="size-3" />
                      <span className="truncate">{row.resume_name}</span>
                    </p>
                  ) : null}
                  {row.message ? (
                    <p className="line-clamp-3 text-[10px] text-muted-foreground">{row.message}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-[10px] text-muted-foreground">
              No previous submissions in this session.
            </p>
          )}
        </section>
      </div>
    </ScrollArea>
  );
}
