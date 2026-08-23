import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1.5 text-xs text-indigo/60 hover:text-indigo mb-5"
      aria-label="Go back"
    >
      <span aria-hidden="true">←</span> Back
    </button>
  );
}