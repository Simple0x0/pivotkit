interface Props {
  title: string;
  commands: string[];
}

export default function CommandBlock({ title, commands }: Props) {
  return (
    <div>
      <h3>{title}</h3>
      <pre>
        {commands.map((cmd, i) => (
          <div key={i}>{cmd}</div>
        ))}
      </pre>
    </div>
  );
}
