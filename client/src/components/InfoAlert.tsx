interface InfoProps {
  text: string;
}

const InfoAlert = ({ text }: InfoProps) => {
  return (
    <div className="alert alert-info flex justify-center m-2" role="alert">
      <span className="font-medium">{text} :(</span>
    </div>
  );
};
export default InfoAlert;
