interface shareGroupProps {
  link: string;
  onCopy: () => void;
}

const ShareGroup = ({ link, onCopy }: shareGroupProps) => {
  function shareGroup() {
    navigator.clipboard.writeText(link);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl">Share link: </p>
      <p className="text-lg">{link}</p>
      <button
        className="btn btn-outline btn-secondary"
        onClick={() => {
          shareGroup();
          onCopy();
        }}
      >
        COPY TO CLIPBOARD
      </button>
    </div>
  );
};
export default ShareGroup;
