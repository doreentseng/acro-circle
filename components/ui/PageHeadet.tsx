export default function PageHeader() {
  return (
    <div className="w-full flex flex-col items-center text-center space-y-1 pt-3 pb-6">
      <h1 className="text-2xl font-semibold text-zinc-900">🤸 ACRO CIRCLE</h1>

      <div className="text-xs text-zinc-400 flex items-center gap-2">
        <span>by</span>
        <a
          href="https://github.com/doreentseng"
          target="_blank"
          className="text-zinc-400 hover:text-pink-500 hover:underline transition"
        >
          @doreentseng
        </a>
        <span>·</span>
        <span>v1.0.0</span>
      </div>
    </div>
  );
}
