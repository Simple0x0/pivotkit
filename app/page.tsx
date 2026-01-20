import Workspace from "@/app/components/Workspace";

export default function Home() {
  return (
    <div className="w-full flex justify-center">
      {/* Workspace placeholder until a tool is selected */}
      <div className="w-full lg:w-4/5">
        <Workspace />
      </div>
    </div>
  );
}
