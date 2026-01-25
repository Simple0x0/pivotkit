// import Workspace from "@/app/components/MainWorkspace";

// export default function Home() {
//   return (
//     <div className="w-full flex justify-center">
//       {/* Workspace placeholder until a tool is selected */}
//       <div className="w-full lg:w-4/5">
//         <Workspace />
//       </div>
//     </div>
//   );
// }


import { redirect } from "next/navigation";

export default function Home() {
  redirect("/tools/ligolo-ng");
}
