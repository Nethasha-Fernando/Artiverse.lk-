import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="px-8 pt-2 pb-0">
      <div className="relative w-full h-[660px] overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1400&auto=format&fit=crop"
          alt="Artist workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-14">
          <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight max-w-sm">
            Step into a world painted by imagination
          </h1>
          <p className="text-white/80 text-sm mt-4 max-w-[220px] leading-relaxed">
            We bring creativity from the artist's hands to your home
          </p>
          <div className="mt-8 space-y-2">
            <p className="text-white/75 text-sm">Ready to showcase your creations?</p>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition shadow-lg"
            >
              Become an artist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}