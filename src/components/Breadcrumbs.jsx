import { Link } from "react-router-dom";

export default function Breadcrumbs({ breadcrumbs = [] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      <Link to="/" className="rounded px-2 py-1 font-medium hover:bg-gray-100 hover:text-gray-900">
        My Drive
      </Link>
      {breadcrumbs.map((b) => (
        <span key={b.id} className="flex items-center gap-1">
          <span className="text-gray-300">/</span>
          <Link
            to={`/folder/${b.id}`}
            className="rounded px-2 py-1 hover:bg-gray-100 hover:text-gray-900"
          >
            {b.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
