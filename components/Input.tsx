export function Input({ error, ...props }) {
  return (
    <div className="flex flex-col w-full items-start">
      <input
        type="text"
        autoComplete="do-not-autofill"
        className={`input input-bordered focus:input-primary input-lg rounded-full flex-grow font-mono text-center w-full text-lg ${
          error ? "input-error" : ""
        }`}
        {...props}
      />
      {error && <span className="pl-6 text-error font-bold">{error}</span>}
    </div>
  );
}
