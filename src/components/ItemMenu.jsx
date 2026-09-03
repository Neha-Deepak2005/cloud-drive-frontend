import { useEffect, useRef, useState } from "react";

export default function ItemMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
      >
        ⋮
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-30 mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {actions.map((a, i) =>
            a.divider ? (
              <div key={i} className="my-1 border-t border-gray-100" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  a.onClick();
                }}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                  a.danger ? "text-red-600" : "text-gray-700"
                }`}
              >
                {a.icon} {a.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
