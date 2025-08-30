interface shareGroupProps {
  joinLink: string;
  viewLink: string;
  onCopy: () => void;
}

const ShareGroup = ({ joinLink, viewLink, onCopy }: shareGroupProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl">Share link: </p>
      <p className="text-lg">{joinLink}</p>
      <button
        className="btn btn-outline btn-secondary"
        onClick={() => {
          navigator.clipboard.writeText(joinLink);
          onCopy();
        }}
      >
        COPY TO CLIPBOARD
      </button>
      <p className="text-xl">View link: </p>
      <p className="text-lg">{viewLink}</p>
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
