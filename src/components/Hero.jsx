import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
const Hero = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-neutral-content text-center">
                  
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Real People. Real Connections.
            </h1>
            <p className="mb-5">
              Find someone who truly gets you. Swipe, chat, and build meaningful
              relationships.
            </p>
            <h4>❤️ Join Today & Meet Your Match!</h4>
            {!user && (<button className="btn btn-primary" onClick={()=>navigate('/login')}>Get Started</button>)}
          </div>
        </div>
      </div>
          
          {/* <div className="diff aspect-[16/9]">
  <div className="diff-item-1">
    <div className="bg-primary text-primary-content grid place-content-center text-9xl font-black">
      TINDER
    </div>
  </div>
  <div className="diff-item-2">
    <div className="bg-base-200 grid place-content-center text-9xl font-black">TINDER</div>
  </div>
  <div className="diff-resizer"></div>
</div>
           */}
    </div>
  );
};

export default Hero;
