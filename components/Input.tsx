export function Input({ placeholder, value, error, onChange }) {
  return (
    <div className="flex flex-col w-full items-start my-2">
      <input
        type="text"
        className={`input input-bordered focus:input-primary input-lg rounded-full flex-grow font-mono text-center w-full text-lg ${
          error ? "input-error" : ""
        }`}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      {
        error &&
          <span className="pl-6 text-error font-bold">
            {error}
          </span>
      }
    </div>
  )
}
