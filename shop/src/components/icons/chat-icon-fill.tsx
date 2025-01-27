const ChatIconFill: React.FC<React.SVGAttributes<{}>> = ({
  width = 20,
  height = 20,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-chat-right-fill"
      viewBox="0 0 16 16"
    >
      <path d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
    </svg>
  );
};

export default ChatIconFill;
