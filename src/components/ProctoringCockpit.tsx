import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Check,
  ChevronDown,
  CircleStop,
  Clock3,
  Copy,
  FileCode2,
  FileText,
  Gauge,
  History,
  LockKeyhole,
  Mic,
  MicOff,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Radio,
  Settings,
  ShieldCheck,
  UserRound,
  Video,
  VideoOff,
  Wifi,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import recrovoLogo from "@/assets/recrovo-logo.png";
import { CandidateSubmissionPanel } from "@/components/CandidateSubmissionPanel";
import { ThemeToggle, type ThemePreference } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const codeLines = [
  <>
    <span className="text-syntax-keyword">import</span> time
  </>,
  <>
    <span className="text-syntax-keyword">from</span> dataclasses{" "}
    <span className="text-syntax-keyword">import</span> dataclass
  </>,
  <>
    <span className="text-syntax-keyword">from</span> typing{" "}
    <span className="text-syntax-keyword">import</span> Tuple, Optional
  </>,
  <></>,
  <>
    <span className="text-syntax-decorator">@dataclass</span>
  </>,
  <>
    class <span className="text-syntax-class">RateLimitResult</span>:
  </>,
  <> allowed: bool</>,
  <> remaining: int</>,
  <>
    {" "}
    retry_after_ms: Optional[int] = <span className="text-syntax-keyword">None</span>
  </>,
  <></>,
  <>
    class <span className="text-syntax-class">SlidingWindowCounter</span>:
  </>,
  <>
    {" "}
    <span className="text-syntax-string">
      &quot;&quot;&quot;High-performance multi-threaded sliding window rate
      limiter.&quot;&quot;&quot;
    </span>
  </>,
  <></>,
  <>
    {" "}
    <span className="text-syntax-keyword">def</span>{" "}
    <span className="text-syntax-fn">__init__</span>(self, redis_client, prefix: str ={" "}
    <span className="text-syntax-string">&apos;rl:&apos;</span>):
  </>,
  <> self.client = redis_client</>,
  <> self.prefix = prefix</>,
  <></>,
  <>
    {" "}
    <span className="text-syntax-keyword">def</span>{" "}
    <span className="text-syntax-fn">is_allowed</span>(self, key: str, limit: int, window_ms: int)
    -&gt;
  </>,
  <>
    {" "}
    <span className="text-syntax-class">RateLimitResult</span>:
  </>,
  <>
    {" "}
    now_ms = int(time.time() * <span className="text-syntax-number">1000</span>)
  </>,
  <> clear_before = now_ms - window_ms</>,
  <>
    {" "}
    redis_key ={" "}
    <span className="text-syntax-string">
      f&apos;{"{"}self.prefix{"}"}
      {"{"}key{"}"}&apos;
    </span>
  </>,
  <></>,
  <>
    {" "}
    <span className="text-syntax-comment">
      # Atomic pipeline execution to curb race conditions across pods
    </span>
  </>,
  <>
    {" "}
    <span className="text-syntax-keyword">with</span> self.client.pipeline(){" "}
    <span className="text-syntax-keyword">as</span> pipe:
  </>,
  <>
    {" "}
    pipe.zremrangebyscore(redis_key, <span className="text-syntax-number">0</span>, clear_before)
  </>,
  <> pipe.zcard(redis_key)</>,
  <>
    {" "}
    count = pipe.execute()[<span className="text-syntax-number">1</span>]
  </>,
  <>
    {" "}
    <span className="text-syntax-keyword">if</span> count &gt;= limit:
  </>,
  <>
    {" "}
    <span className="text-syntax-keyword">return</span> RateLimitResult(
    <span className="text-syntax-keyword">False</span>,{" "}
    <span className="text-syntax-number">0</span>, window_ms)
  </>,
  <>
    {" "}
    pipe.zadd(redis_key, {"{"}now_ms: now_ms{"}"})
  </>,
  <>
    {" "}
    pipe.expire(redis_key, window_ms // <span className="text-syntax-number">1000</span> +{" "}
    <span className="text-syntax-number">1</span>)
  </>,
  <> pipe.execute()</>,
  <>
    {" "}
    <span className="text-syntax-keyword">return</span> RateLimitResult(
    <span className="text-syntax-keyword">True</span>, limit - count -{" "}
    <span className="text-syntax-number">1</span>)
  </>,
];

const extendedCodeLines = codeLines;

function IconAction({
  label,
  children,
  onClick,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          variant="ghost"
          size="icon"
          className={`h-7 w-7 rounded-sm hover:text-foreground ${active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-5 gap-1 px-1 text-[10px] text-muted-foreground"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function ProblemBrief({ onCollapse }: { onCollapse: () => void }) {
  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 flex-col bg-panel">
      <Tabs defaultValue="brief" className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-9 w-full shrink-0 items-center border-b border-border bg-panel">
          <TabsList className="h-full flex-1 justify-start rounded-none bg-panel p-0">
            <TabsTrigger
              value="brief"
              className="h-9 rounded-none border-b-2 border-transparent px-3 text-[10px] data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
            >
              <FileCode2 className="mr-1 size-3" />
              Description
            </TabsTrigger>
            <TabsTrigger
              value="resume"
              className="h-9 rounded-none border-b-2 border-transparent px-3 text-[10px] data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
            >
              <FileText className="mr-1 size-3" />
              Resume
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="h-9 rounded-none border-b-2 border-transparent px-3 text-[10px] data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
            >
              <History className="mr-1 size-3" />
              Submissions
            </TabsTrigger>
          </TabsList>
          <div className="flex h-full items-center pr-1">
            <IconAction label="Collapse problem brief" onClick={onCollapse}>
              <PanelLeftClose />
            </IconAction>
          </div>
        </div>
        <TabsContent value="brief" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3 text-[11px] leading-relaxed">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-sm bg-destructive/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-destructive">
                    HARD · 150 PTS
                  </span>
                </div>
                <h1 className="text-base font-semibold leading-tight text-foreground">
                  Problem 03: Distributed Rate Limiter
                </h1>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="tag">Sliding Window</span>
                  <span className="tag">Distributed Systems</span>
                  <span className="tag">Redis 7.2</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Architect a resilient, multi-region distributed sliding-window counter rate limiting
                service for high-throughput public API edge gateways.
              </p>
              <p className="text-muted-foreground">
                Your implementation must govern request volume per client identification key across
                a specified rolling duration without sacrificing concurrency contention and network
                latency jitter.
              </p>
              <section className="panel-box">
                <h2 className="section-title">
                  <Gauge />
                  System SLAs &amp; Constraints
                </h2>
                <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 font-mono text-[10px]">
                  <dt>P99 SLA Latency:</dt>
                  <dd className="text-success">&lt; 2.0 ms</dd>
                  <dt>Max Peak Burst:</dt>
                  <dd className="text-info">10,000 req / sec</dd>
                  <dt>Clock Drift Margin:</dt>
                  <dd>5 ms (NTP synced)</dd>
                  <dt>State Persistence:</dt>
                  <dd className="text-success">In-Memory Sorted Set</dd>
                </dl>
              </section>
              <Example
                title="Example 1 (Basic Acceptance)"
                code={
                  'input: client_id="usr_928", limit=5, window_ms=1000\noutput: {"allowed": true, "remaining": 4, "reset_ms": 1000}'
                }
              />
              <Example
                title="Example 2 (Burst Eviction)"
                code={
                  'input: client_id="usr_928", limit=5, window_ms=1000, t=1700000000550\noutput: {"allowed": false, "retry_after_ms": 550, "remaining": 0}'
                }
              />
              <section>
                <h2 className="section-title">
                  <ShieldCheck />
                  Evaluation Criteria
                </h2>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Atomicity across distributed workers</li>
                  <li>• Predictable memory reclamation</li>
                  <li>• Accurate rolling-window boundaries</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="resume" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-3">
              <section className="panel-box">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-sm border border-border bg-code">
                    <UserRound className="size-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold">Alex Mercer</h2>
                    <p className="text-[9px] text-muted-foreground">Senior Backend Engineer</p>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="section-title">Experience summary</h3>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  Distributed systems engineer focused on high-throughput APIs, Redis-backed
                  services, and resilient multi-region infrastructure.
                </p>
              </section>
              <section>
                <h3 className="section-title">Core skills</h3>
                <div className="flex flex-wrap gap-1">
                  {["Python", "Redis", "Kubernetes", "System Design", "AWS"].map((skill) => (
                    <span className="tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
              <section className="panel-box flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium">alex-mercer-resume.pdf</p>
                  <p className="text-[8px] text-muted-foreground">Candidate resume · PDF</p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="submissions" className="mt-0 min-h-0 flex-1">
          <CandidateSubmissionPanel />
        </TabsContent>
      </Tabs>
      <div className="flex h-7 items-center justify-between border-t border-border px-3 font-mono text-[9px] text-muted-foreground">
        <span>Test Matrix: 4/4 passed</span>
        <span className="text-success">100% Coverage</span>
      </div>
    </aside>
  );
}

function Example({ title, code }: { title: string; code: string }) {
  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-mono text-[10px] font-semibold">{title}</h2>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto rounded-sm border border-border bg-code p-2 font-mono text-[9px] leading-relaxed text-syntax-string whitespace-pre-wrap">
        {code}
      </pre>
    </section>
  );
}

function CodeEditor() {
  const [file, setFile] = useState("rate");
  return (
    <div
      data-testid="code-editor"
      className="min-h-0 flex-1 overflow-y-auto bg-code scrollbar-thin"
    >
      {file === "rate" ? (
        <div className="min-w-[680px] py-2 font-mono text-[12px] leading-6">
          {extendedCodeLines.map((line, index) => (
            <div
              key={index}
              className={`grid grid-cols-[46px_1fr] px-2 ${index === 17 ? "bg-editor-line" : ""}`}
            >
              <span className="select-none border-r border-border pr-3 text-right text-line-number">
                {index + 1}
              </span>
              <code className="block pl-4 whitespace-pre text-code-foreground">{line}</code>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 font-mono text-xs leading-6 text-code-foreground">
          <span className="text-syntax-keyword">def</span>{" "}
          <span className="text-syntax-fn">test_distributed_race</span>():
          <br />
          {"    "}
          <span className="text-syntax-comment">
            # 50 workers should never exceed the shared limit
          </span>
          <br />
          {"    "}
          <span className="text-syntax-keyword">assert</span> accepted_count =={" "}
          <span className="text-syntax-number">10</span>
        </div>
      )}
    </div>
  );
}

function EvaluationResult() {
  return (
    <section data-testid="test-runner" className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center border-b border-border px-3">
        <h2 className="text-[10px] font-semibold text-primary">Test Result</h2>
      </div>
      <div className="p-3 text-[10px] text-muted-foreground">
        Run your code to see evaluation results here.
      </div>
    </section>
  );
}

function CenterWorkspace({
  problemBriefCollapsed,
  interviewerDeckCollapsed,
  onRestoreProblemBrief,
  onRestoreInterviewerDeck,
}: {
  problemBriefCollapsed: boolean;
  interviewerDeckCollapsed: boolean;
  onRestoreProblemBrief: () => void;
  onRestoreInterviewerDeck: () => void;
}) {
  const [file, setFile] = useState("rate");
  const [openFiles, setOpenFiles] = useState(["rate", "test"]);
  const [running, setRunning] = useState(false);
  const closeFile = (closedFile: string) => {
    const remainingFiles = openFiles.filter((openFile) => openFile !== closedFile);
    setOpenFiles(remainingFiles);
    if (file === closedFile) setFile(remainingFiles[0] ?? "");
  };
  return (
    <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-code">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border bg-panel px-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Candidate
          </span>
          <span className="truncate text-[10px] font-medium">Senior Distributed Systems</span>
        </div>
        <div className="flex items-center gap-1">
          {problemBriefCollapsed && (
            <IconAction label="Restore problem brief" onClick={onRestoreProblemBrief}>
              <PanelLeftOpen />
            </IconAction>
          )}
          {interviewerDeckCollapsed && (
            <IconAction label="Restore interviewer deck" onClick={onRestoreInterviewerDeck}>
              <PanelRightOpen />
            </IconAction>
          )}
          <Select defaultValue="python">
            <SelectTrigger
              aria-label="Language"
              className="h-7 w-[164px] rounded-sm border-border bg-code px-2 font-mono text-[9px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python 3.12 (CPython)</SelectItem>
              <SelectItem value="typescript">TypeScript 5.8</SelectItem>
              <SelectItem value="go">Go 1.24</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-7 rounded-sm px-3 text-[10px]"
            onClick={() => {
              setRunning(true);
              window.setTimeout(() => setRunning(false), 900);
            }}
          >
            {running ? <Activity className="animate-spin" /> : <Play />}
            {running ? "Running…" : "Run & Submit"}
          </Button>
        </div>
      </div>
      <div className="flex h-8 shrink-0 items-stretch border-b border-border bg-panel-raised">
        {openFiles.map((openFile) => {
          const isRateFile = openFile === "rate";
          const fileName = isRateFile ? "rate_limiter.py" : "test_concurrency.py";
          return (
            <div
              key={openFile}
              className={`flex items-center border-r border-border font-mono text-[9px] ${file === openFile ? "border-t-2 border-t-primary bg-code text-foreground" : "text-muted-foreground"}`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(openFile)}
                className="h-full rounded-none px-3 font-mono text-[9px]"
              >
                <FileCode2 className={`size-3 ${isRateFile ? "text-primary" : ""}`} />
                {fileName}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Close ${fileName}`}
                onClick={() => closeFile(openFile)}
                className="mr-1 size-5 rounded-sm text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Button>
            </div>
          );
        })}
        <div className="ml-auto flex items-center px-3 font-mono text-[8px] text-muted-foreground">
          {file === "rate" ? "rate_limiter.py > SlidingWindowCounter > is_allowed()" : file === "test" ? "test_concurrency.py > test_distributed_race()" : "No file selected"}
        </div>
      </div>
      <Group
        id="editor-result-split"
        orientation="vertical"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        defaultLayout={{ "editor-panel": 76, "test-result-panel": 24 }}
        resizeTargetMinimumSize={{ fine: 8, coarse: 20 }}
      >
        <Panel
          id="editor-panel"
          defaultSize="76%"
          minSize="30%"
          maxSize="90%"
          className="flex min-h-0 min-w-0 flex-col"
          style={{ overflow: "hidden" }}
        >
          {file === "rate" ? (
            <CodeEditor />
          ) : file === "test" ? (
            <div
              data-testid="code-editor"
              className="min-h-0 flex-1 overflow-y-auto bg-code p-5 font-mono text-xs leading-6 text-code-foreground"
            >
              <span className="text-syntax-keyword">def</span>{" "}
              <span className="text-syntax-fn">test_distributed_race</span>():
              <br />
              {"    "}
              <span className="text-syntax-comment">
                # 50 workers should never exceed the shared limit
              </span>
              <br />
              {"    "}
              <span className="text-syntax-keyword">assert</span> accepted_count =={" "}
              <span className="text-syntax-number">10</span>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center gap-2 bg-code text-[10px] text-muted-foreground">
              <span>All files are closed.</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOpenFiles(["rate", "test"]);
                  setFile("rate");
                }}
                className="h-7 rounded-sm px-2 text-[10px] text-primary"
              >
                Reopen files
              </Button>
            </div>
          )}
        </Panel>
        <Separator
          id="editor-result-divider"
          aria-label="Resize editor and test results"
          className="z-10 h-1 shrink-0 bg-border outline-none transition-colors hover:bg-primary focus-visible:bg-primary data-[separator=active]:bg-primary"
        />
        <Panel
          id="test-result-panel"
          defaultSize="24%"
          minSize="10%"
          maxSize="70%"
          className="min-h-0 min-w-0"
          style={{ overflow: "hidden" }}
        >
          <EvaluationResult />
        </Panel>
      </Group>
    </main>
  );
}

function VideoFeed({
  name,
  live,
  stream,
}: {
  name: string;
  live?: boolean;
  stream?: MediaStream | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream ?? null;
  }, [stream]);
  return (
    <div>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-sm border border-border bg-video">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 size-full -scale-x-100 object-cover"
          />
        ) : (
          <UserRound className="size-8 text-muted-foreground" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-5 bg-panel/80" />
        {live && (
          <span className="absolute right-1 top-1 rounded-sm bg-destructive px-1 py-0.5 text-[7px] font-semibold text-destructive-foreground">
            LIVE
          </span>
        )}
      </div>
      <div className="mt-1 text-center text-[8px] text-muted-foreground">{name}</div>
    </div>
  );
}

function TelemetryRow({
  label,
  value,
  color = "primary",
}: {
  label: string;
  value: number;
  color?: "primary" | "success";
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px]">
        <span>{label}</span>
        <span className={color === "success" ? "text-success" : "text-info"}>
          {label === "Stress Level" ? `Low (${value}%)` : `${value}%`}
        </span>
      </div>
      <Progress
        value={value}
        className={`h-1 ${color === "success" ? "[&>div]:bg-success" : "[&>div]:bg-info"}`}
      />
    </div>
  );
}

function InterviewerDeck({
  cameraStream,
  onCollapse,
}: {
  cameraStream: MediaStream | null;
  onCollapse: () => void;
}) {
  const criteria = ["Architecture", "Code Quality", "Communication", "Speed"];
  const [scores, setScores] = useState<Record<string, number>>({
    Architecture: 5,
    "Code Quality": 5,
    Communication: 4,
    Speed: 5,
  });
  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border px-2">
        <h2 className="flex items-center gap-1 text-[10px] font-semibold">
          <Video className="size-3 text-primary" />
          Interviewer Deck
        </h2>
        <div className="flex items-center gap-1">
          <span className="rounded-sm border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] text-primary">
            Confidential
          </span>
          <IconAction label="Collapse interviewer deck" onClick={onCollapse}>
            <PanelRightClose />
          </IconAction>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-2 p-2">
          <div className="grid gap-2">
            <VideoFeed name="Candidate Feed" live={!!cameraStream} stream={cameraStream} />
            <VideoFeed name="Interviewer Feed" />
          </div>
          <section className="panel-box space-y-2.5">
            <h3 className="section-title">
              <Activity />
              Live Behavioral Telemetry{" "}
              <span className="ml-auto font-normal text-muted-foreground">Real-time</span>
            </h3>
            <TelemetryRow label="Candidate Confidence" value={88} />
            <TelemetryRow label="Technical Fluency" value={92} />
            <TelemetryRow label="Stress Level" value={18} color="success" />
          </section>
          <section className="panel-box">
            <h3 className="section-title">
              <Mic />
              Speech-to-Text Stream
            </h3>
            <div className="space-y-2 text-[9px] leading-relaxed">
              <p>
                <time className="font-mono text-muted-foreground">14:18</time>{" "}
                <strong className="text-info">Interviewer:</strong> How will you prevent memory
                leaks when keys accumulate over 24-hour periods?
              </p>
              <p>
                <time className="font-mono text-muted-foreground">14:21</time>{" "}
                <strong className="text-primary">Candidate:</strong> We can leverage Redis sorted
                sets with ZREMRANGEBYSCORE to clear obsolete timestamps during atomic evaluation,
                paired with a short TTL.
              </p>
              <p>
                <time className="font-mono text-muted-foreground">14:22</time>{" "}
                <strong className="text-info">Interviewer:</strong> What changes across regions?
              </p>
            </div>
          </section>
          <section className="panel-box">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="section-title mb-0">
                <Gauge />
                Interviewer Rubric
              </h3>
              <span className="rounded-sm bg-success/15 px-1.5 py-0.5 text-[8px] text-success">
                Strong Hire (4.8)
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {criteria.map((criterion) => (
                <div key={criterion} className="text-center">
                  <div className="mb-1 truncate text-[7px] uppercase text-muted-foreground">
                    {criterion}
                  </div>
                  <div className="flex justify-center gap-px">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        aria-label={`${criterion} score ${score}`}
                        variant="outline"
                        size="icon"
                        className={`h-5 w-5 rounded-none border-border p-0 text-[8px] ${scores[criterion] === score ? "bg-primary text-primary-foreground" : "bg-panel-raised text-muted-foreground"}`}
                        onClick={() => setScores({ ...scores, [criterion]: score })}
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <textarea
              aria-label="Confidential proctor notes"
              placeholder="Confidential proctor notes…"
              className="mt-3 h-14 w-full resize-none rounded-sm border border-border bg-code p-2 text-[9px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </section>
        </div>
      </ScrollArea>
      <div className="flex h-7 items-center justify-between border-t border-border px-2 font-mono text-[8px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <LockKeyhole className="size-2.5 text-primary" />
          Confidential Proctor Session
        </span>
        <span>v2.4.8</span>
      </div>
    </aside>
  );
}

export function ProctoringCockpit() {
  const [ended, setEnded] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>("default");
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("recrovo-theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "default") {
      setTheme(savedTheme);
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => setSystemDark(media.matches);
    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, []);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const problemBriefRef = usePanelRef();
  const interviewerDeckRef = usePanelRef();
  const [problemBriefCollapsed, setProblemBriefCollapsed] = useState(false);
  const [interviewerDeckCollapsed, setInterviewerDeckCollapsed] = useState(false);

  useEffect(() => () => cameraStream?.getTracks().forEach((t) => t.stop()), [cameraStream]);
  useEffect(() => () => micStream?.getTracks().forEach((t) => t.stop()), [micStream]);

  const collapseProblemBrief = () => {
    problemBriefRef.current?.collapse();
    setProblemBriefCollapsed(true);
  };
  const collapseInterviewerDeck = () => {
    interviewerDeckRef.current?.collapse();
    setInterviewerDeckCollapsed(true);
  };
  const restoreProblemBrief = () => {
    problemBriefRef.current?.expand();
    setProblemBriefCollapsed(false);
  };
  const restoreInterviewerDeck = () => {
    interviewerDeckRef.current?.expand();
    setInterviewerDeckCollapsed(false);
  };

  const toggleMedia = async (kind: "camera" | "mic") => {
    const current = kind === "camera" ? cameraStream : micStream;
    const set = kind === "camera" ? setCameraStream : setMicStream;
    if (current) {
      set(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        kind === "camera" ? { video: true } : { audio: true },
      );
      set(stream);
    } catch {
      toast.error(
        `${kind === "camera" ? "Camera" : "Microphone"} access was blocked or unavailable.`,
        {
          description: "Allow the browser permission for this device and try turning it on again.",
        },
      );
    }
  };

  const isDark = theme === "dark" || (theme === "default" && systemDark);
  const setPreferredTheme = (value: ThemePreference) => {
    setTheme(value);
    window.localStorage.setItem("recrovo-theme", value);
  };

  return (
    <TooltipProvider delayDuration={250}>
      <div
        data-theme={theme}
        className={`${isDark ? "dark" : ""} flex h-screen max-h-screen w-full flex-col overflow-hidden bg-background text-foreground`}
      >
        <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-panel px-2">
          <div className="flex items-center gap-2">
            <img src={recrovoLogo} alt="Recrovo logo" className="size-6 shrink-0 object-contain" />
            <span className="text-xs font-bold text-foreground">Recrovo IDE</span>
            <span className="hidden font-mono text-[8px] text-muted-foreground sm:inline">
              #4892-PROCTOR
            </span>
          </div>
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center overflow-hidden rounded-sm border border-border bg-code">
            <span className="flex h-6 items-center gap-1.5 border-r border-border px-2 font-mono text-[8px] font-semibold text-success">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-destructive" />
              </span>
              LIVE RECORDING
            </span>
            <span className="flex h-6 items-center gap-1 px-2 font-mono text-[8px] text-muted-foreground">
              <Clock3 className="size-2.5 text-info" />
              45:59 remaining
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <ThemeToggle isDark={isDark} onThemeChange={setPreferredTheme} />
            <IconAction
              label={micStream ? "Turn microphone off" : "Turn microphone on"}
              active={!!micStream}
              onClick={() => toggleMedia("mic")}
            >
              {micStream ? <Mic /> : <MicOff />}
            </IconAction>
            <IconAction
              label={cameraStream ? "Turn camera off" : "Turn camera on"}
              active={!!cameraStream}
              onClick={() => toggleMedia("camera")}
            >
              {cameraStream ? <Video /> : <VideoOff />}
            </IconAction>
            <IconAction label="Session settings">
              <Settings />
            </IconAction>
            <Button
              variant="destructive"
              size="sm"
              className="ml-1 h-7 rounded-sm px-3 text-[9px]"
              onClick={() => setEnded(true)}
            >
              <CircleStop />
              {ended ? "Session Ended" : "End Session"}
            </Button>
          </div>
        </header>
        <Group
          id="workspace-columns"
          orientation="horizontal"
          className="flex min-h-0 min-w-0 flex-1 overflow-hidden"
          defaultLayout={{
            "problem-brief-panel": 24,
            "center-workspace-panel": 51,
            "interviewer-deck-panel": 25,
          }}
          resizeTargetMinimumSize={{ fine: 8, coarse: 20 }}
        >
          <Panel
            id="problem-brief-panel"
            panelRef={problemBriefRef}
            collapsible
            collapsedSize="0px"
            onResize={(size) => setProblemBriefCollapsed(size.asPercentage < 0.1)}
            defaultSize="24%"
            minSize="220px"
            maxSize="38%"
            className="min-h-0 min-w-0"
            style={{ overflow: "hidden" }}
          >
            <ProblemBrief onCollapse={collapseProblemBrief} />
          </Panel>
          <Separator
            id="problem-brief-divider"
            aria-label="Resize problem brief and editor"
            className="z-10 w-1 shrink-0 bg-border outline-none transition-colors hover:bg-primary focus-visible:bg-primary data-[separator=active]:bg-primary"
          />
          <Panel
            id="center-workspace-panel"
            defaultSize="51%"
            minSize="360px"
            className="min-h-0 min-w-0"
            style={{ overflow: "hidden" }}
          >
            <CenterWorkspace
              problemBriefCollapsed={problemBriefCollapsed}
              interviewerDeckCollapsed={interviewerDeckCollapsed}
              onRestoreProblemBrief={restoreProblemBrief}
              onRestoreInterviewerDeck={restoreInterviewerDeck}
            />
          </Panel>
          <Separator
            id="interviewer-deck-divider"
            aria-label="Resize editor and interviewer deck"
            className="z-10 w-1 shrink-0 bg-border outline-none transition-colors hover:bg-primary focus-visible:bg-primary data-[separator=active]:bg-primary"
          />
          <Panel
            id="interviewer-deck-panel"
            panelRef={interviewerDeckRef}
            collapsible
            collapsedSize="0px"
            onResize={(size) => setInterviewerDeckCollapsed(size.asPercentage < 0.1)}
            defaultSize="25%"
            minSize="260px"
            maxSize="38%"
            className="min-h-0 min-w-0"
            style={{ overflow: "hidden" }}
          >
            <InterviewerDeck cameraStream={cameraStream} onCollapse={collapseInterviewerDeck} />
          </Panel>
        </Group>
        <div className="flex h-5 shrink-0 items-center justify-between border-t border-border bg-panel px-2 font-mono text-[8px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Wifi className="size-2.5 text-success" />
            Secure link · 18 ms
          </span>
          <span className="flex items-center gap-3">
            <span>Python 3.12.2</span>
            <span className="text-success">● Ready</span>
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}
