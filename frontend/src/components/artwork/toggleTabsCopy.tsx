// import { useState } from "react";
// import ArtworkFilters from "./ArtworkFilters";

// function ToggleTabs() {
//   //const [selected, setSelected] = useState("arts");
//   const [selected, setSelected] = useState<"arts" | "artists">("arts");

//   return (
//     <>
//       <div className="simple-toggle-tabs">
//         <button
//           className={selected === "arts" ? "active" : ""}
//           onClick={() => setSelected("arts")}
//         >
//           Arts
//         </button>
//         <button
//           className={selected === "artists" ? "active" : ""}
//           onClick={() => setSelected("artists")}
//         >
//           Artists
//         </button>
//       </div>
//     </>
//   );
// }

// export default ToggleTabs;







// import { useState } from "react";

// function ToggleTabs() {
//   const [selected, setSelected] = useState<"arts" | "artists">("arts");

//   return (
//     <div className="w-full flex justify-start ml-[208px] my-4">
//       <div className="inline-flex gap-1 p-1 border border-[#ff4d4d] rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
//         <button
//           onClick={() => setSelected("arts")}
//           className={`px-6 py-2 text-sm font-[Rubik] font-medium rounded-full transition 
//             ${
//               selected === "arts"
//                 ? "bg-[#ff4d4d] text-white shadow-[0_2px_10px_rgba(255,77,77,0.3)]"
//                 : "text-[#3f3f3f] hover:bg-[#fff5f5] hover:text-[#ff4d4d]"
//             }`}
//         >
//           Arts
//         </button>
//         <button
//           onClick={() => setSelected("artists")}
//           className={`px-6 py-2 text-sm font-[Rubik] font-medium rounded-full transition 
//             ${
//               selected === "artists"
//                 ? "bg-[#ff4d4d] text-white shadow-[0_2px_10px_rgba(255,77,77,0.3)]"
//                 : "text-[#3f3f3f] hover:bg-[#fff5f5] hover:text-[#ff4d4d]"
//             }`}
//         >
//           Artists
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ToggleTabs;

