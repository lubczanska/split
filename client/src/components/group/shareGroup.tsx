interface shareGroupProps {
  joinLink: string;
  viewLink: string;
  onCopy: () => void;
}

const ShareGroup = ({ joinLink, viewLink, onCopy }: shareGroupProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl font-bold">Share link: </p>
      <div className="card bg-base-200">
        <p className="text-lg">{joinLink}</p>
      </div>
      <button
        className="btn btn-outline btn-secondary"
        onClick={() => {
          navigator.clipboard.writeText(joinLink);
          onCopy();
        }}
      >
        COPY TO CLIPBOARD
      </button>
      <p className="text-xl font-bold">View link: </p>
      <div className="card bg-base-200">
        <p className="text-lg">{viewLink}</p>{" "}
      </div>
      <button
        className="btn btn-outline btn-secondary"
        onClick={() => {
          navigator.clipboard.writeText(viewLink);
          onCopy();
        }}
      >
        COPY TO CLIPBOARD
      </button>
    </div>
  );
};
export default ShareGroup;
