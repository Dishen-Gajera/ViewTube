import React, { useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import logo from "../assets/viewtube.png";
import { FaSearch } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaHome, FaHistory, FaList, FaThumbsUp, FaTimes } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../components/Profile";
import AllVideosPage from "../components/AllVideosPage";
import AllShortsPage from "../components/AllShortsPage";
import { showAlertHandler } from "../components/CustomAlert";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import SearchResult from "../components/SearchResult";
import FilterResult from "../components/FilterResult";
import RecommendedContent from "./RecommendedContent";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const location = useLocation();
  const [active, setActive] = useState("Home");
  const [popup, setPopup] = useState(false);
  const [serachPopup, setSearchPopup] = useState(false);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [loading1, setLoading1] = useState(false);
  const { userData, subscribedChannels } = useSelector((state) => state.user);
  const [filterData, setFilterData] = useState("");

  const navigate = useNavigate();

  function speak(message) {
    window.speechSynthesis.cancel();
    let voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find((voice) => {
      return (
        voice.name.includes("Google US English") ||
        voice.name.includes("Female") ||
        voice.name.includes("Zira") ||
        voice.name.includes("Samantha") ||
        voice.name.includes("Google UK English Female")
      );
    });

    let utterance = new SpeechSynthesisUtterance(message);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.pitch = 1.5;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
    utterance.onerror = (e) => console.error("SpeechSynthesis Error:", e);
  }

  const recognitionRef = useRef();
  if (
    !recognitionRef.current &&
    (window.SpeechRecogntion || window.webkitSpeechRecognition)
  ) {
    const Speechrecongnition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new Speechrecongnition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";
  }

  const handleSearch = async () => {
    if (!recognitionRef.current) {
      showAlertHandler("Speech Recognition not supported in your browser");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    setListening(true);
    recognitionRef.current.start();
    recognitionRef.current.onresult = async (e) => {
      console.log(e);
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      setListening(false);
      await handleSearchData(transcript);
    };

    recognitionRef.current.onerror = (err) => {
      console.error("Recognitiom error :" + err);
      setListening(false);
      if (err.error === "no-speech") {
        showAlertHandler("No speech detected. please try again");
      } else {
        showAlertHandler("voice search failed try again");
      }
    };
    recognitionRef.current.onend = () => {
      setListening(false);
    };
  };

  const handleSearchData = async (query) => {
    if (!query.trim()) {
      return;
    }
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/content/search`,
        { input: query },
        { withCredentials: true }
      );
      setSearchData(result.data);
      console.log(result.data);
      setInput("");
      setSearchPopup(false);
      setLoading(false);
      const {
        videos = [],
        shorts = [],
        playlists = [],
        channels = [],
      } = result.data;

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("These are top results I found for you");
      } else {
        speak("No search content found please try again");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handlecategory = async (category) => {
    try {
      setLoading1(true);
      const result = await axios.post(
        `${serverUrl}/api/content/filter`,
        {
          input: category,
        },
        { withCredentials: true }
      );
      const { videos = [], shorts = [], channels = [] } = result.data;

      let channelVideos = [];
      let channelShorts = [];
      channels?.forEach((ch) => {
        if (ch.videos?.length) channelVideos.push(...ch.videos);
        if (ch.shorts?.length) channelShorts.push(...ch.shorts);
      });
      setFilterData({
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });
      console.log(result.data);
      setLoading1(false);
      navigate("/");
      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        channelVideos.length > 0 ||
        channelShorts.length > 0
      ) {
        speak(`here are some ${category} videos and shorts for you`);
      } else {
        speak(`No result found`);
      }
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  };

  const categories = [
    "Music",
    "Gaming",
    "Movies",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs",
  ];
  return (
    <div
      className="bg-[#0f0f0f] text-white min-h-screen rela
    tive "
    >
      {serachPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] sm:min-h-[480px] p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setSearchPopup(false)}
            >
              <FaTimes size={22} />
            </button>
            <div className="flex flex-col items-center gap-3">
              {listening ? (
                <h1 className="text-xl sm:text-2xl font-semibold text-orange-400 animate-pulse">
                  Listening...
                </h1>
              ) : (
                <h1 className="text-lg sm:text-xl font-medium text-gray-300">
                  Speak or type Content
                </h1>
              )}
              {input && (
                <span className="text-center text-lg sm:text-xl text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]/60">
                  {input}
                </span>
              )}
              <div className="flex w-full gap-2 md:hidden mt-4">
                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  type="text"
                  className="px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Type your search"
                />
                <button
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full text-white font-semibold shadow-md transition disabled:opacity-50"
                  onClick={() => handleSearchData(input)}
                >
                  {loading ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    <FaSearch />
                  )}
                </button>
              </div>
            </div>

            <button
              className="p-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 bg-orange-500 hover:bg-orange-600 shadow-orange-500/40"
              onClick={() => handleSearch()}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                <FaMicrophone size={24} />
              )}
            </button>
          </div>
        </div>
      )}

      {/*navbar*/}

      <header className="bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          {/* left */}
          <div className="flex items-center gap-4">
            <button className="text-xl p-2 rounded-full bg-[#272727] md:inline hidden">
              <FaBars onClick={() => setSidebarOpen((prev) => !prev)} />
            </button>

            <div className="flex items-center gap-[5px]">
              <img src={logo} alt="" className="w-[30px]" />
              <span className="text-white font-bold text-xl tracking-tight font-roboto">
                View Tube
              </span>
            </div>
          </div>

          {/* serach */}

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                className="bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700 flex-1"
                placeholder="Search"
              />
              <button
                className="bg-[#272727] px-4 rounded-r-full border-gray-700"
                onClick={() => handleSearchData(input)}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  <FaSearch />
                )}
              </button>
            </div>
            <button
              className="bg-[#272727] p-3 rounded-full"
              onClick={() => setSearchPopup((prev) => !prev)}
            >
              <FaMicrophone />
            </button>
          </div>

          {/* right */}
          <div className="flex items-center gap-3">
            {userData?.channel && (
              <button
                className="hidden md:flex items-center gap-1 bg-[#272727] px-3 py-1 rounded-full cursor-pointer"
                onClick={() => navigate("/createpage")}
              >
                <span className="text-lg">+</span>
                <span>Create</span>
              </button>
            )}
            {!userData?.photourl ? (
              <FaUserCircle
                className="text-3xl hidden md:flex text-gray-400"
                onClick={() => setPopup((prev) => !prev)}
              />
            ) : (
              <img
                src={userData.photourl}
                className="w-9 h-9 rounded-full object-cover border border-gray-700 hidden md:flex"
                onClick={() => setPopup((prev) => !prev)}
              />
            )}

            <FaSearch
              className="flex md:hidden text-lg"
              onClick={() => setSearchPopup((prev) => !prev)}
            />
          </div>
        </div>
      </header>

      {/*sidebar*/}

      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 z-40
        ${sidebarOpen ? "w-60" : "w-20"} hidden md:flex flex-col overflow-y-auto
        `}
      >
        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHome />}
            text={"Home"}
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />
          <SidebarItem
            icon={<SiYoutubeshorts />}
            text={"Shorts"}
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text={"Subscriptions"}
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscription");
            }}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sidebarOpen && <p className="text-sm text-gray-400 px-2">You</p>}

        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHistory />}
            text={"History"}
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => {
              setSelectedItem("History");
              navigate("/historycontent");
            }}
          />
          <SidebarItem
            icon={<FaList />}
            text={"Playlists"}
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => {
              setSelectedItem("Playlists");
              navigate("/savedplaylists");
            }}
          />
          <SidebarItem
            icon={<GoVideo />}
            text={"Saved Videos"}
            open={sidebarOpen}
            selected={selectedItem === "Save Videos"}
            onClick={() => {
              setSelectedItem("Save Videos");
              navigate("/savedcontent");
            }}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text={"Liked Videos"}
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => {
              setSelectedItem("Liked Videos");
              navigate("/likedcontent");
            }}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sidebarOpen && (
          <p className="text-sm text-gray-400 px-2">Subscriptions</p>
        )}
        <div className="space-y-1 mt-1">
          {subscribedChannels?.map((ch) => {
            return (
              <button
                key={ch._id}
                onClick={() => {
                  setSelectedItem(ch._id);
                  navigate("/channelpage/" + ch?._id);
                }}
                className={`flex items-center ${
                  sidebarOpen ? "gap-3 justify-start" : "justify-center"
                }w-full text-left cursor-pointer p-2 rounded-lg transition ${
                  selectedItem === ch._id
                    ? "bg-[#272727]"
                    : "hover:bg-[bg-gray-800]"
                } w-full`}
              >
                <img
                  src={ch?.avatar}
                  alt=""
                  className={`w-6 h-6 rounded-full border border-gray-700 object-cover hover:scale-110 transition-transform duration-200 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && (
                  <span className="text-sm text-white truncate">
                    {ch?.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* main area */}

      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300  ${
          sidebarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >
        {location.pathname === "/" && (
          <>
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pt-2 mt-[60px]">
              {categories.map((cat, idx) => {
                return (
                  <button
                    key={idx}
                    className="whitespace-nowrap bg-[#272727] px-4 py-1.5 text-sm rounded-lg hover:bg-gray-700"
                    onClick={() => handlecategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
              {popup && <Profile />}
            </div>
            <div className="mt-3">
              {loading1 && (
                <div className="w-full items-center flex justify-center">
                  {loading1 ? <ClipLoader size={35} color="white" /> : ""}
                </div>
              )}
              {searchData && <SearchResult SearchResults={searchData} />}
              {filterData && <FilterResult filterResults={filterData} />}
              {userData ? (
                <RecommendedContent />
              ) : (
                <>
                  <AllVideosPage />
                  <AllShortsPage />
                </>
              )}
            </div>
          </>
        )}
        <div className="mt-2 ">
          <Outlet />
        </div>
      </main>

      {/* bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">
        <MobileSizeNav
          icon={<FaHome />}
          text={"Home"}
          active={active === "Home"}
          onClick={() => {
            setActive("Home");

            navigate("/");
          }}
        />
        <MobileSizeNav
          icon={<SiYoutubeshorts />}
          text={"Shorts"}
          active={active === "Shorts"}
          onClick={() => {
            navigate("/shorts");
            setActive("Shorts");
          }}
        />
        <MobileSizeNav
          icon={<IoIosAddCircle size={40} />}
          active={active === "+"}
          onClick={() => {
            setActive("+");
            navigate("/createpage");
          }}
        />
        <MobileSizeNav
          icon={<MdOutlineSubscriptions />}
          text={"Subscription"}
          active={active === "Subscription"}
          onClick={() => {
            setActive("Subscription");
            navigate("/subscription");
          }}
        />

        <MobileSizeNav
          icon={
            !userData?.photourl ? (
              <FaUserCircle text={"You"} />
            ) : (
              <img
                src={userData.photourl}
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            )
          }
          text={"You"}
          active={active === "You"}
          onClick={() => {
            setActive("You");
            navigate("/mobilepro");
          }}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, open, selected, onClick }) {
  return (
    <button
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${
        open ? "justify-items-start" : "justify-center"
      } ${selected ? "bg-[#272727]" : "hover:bg-[#272727]"}`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

function MobileSizeNav({ icon, text, active, onClick }) {
  return (
    <button
      className={`flex flex-col items-center justify-center gap-1
px-3 py-2 rounded-lg transition-all duration-300 ${
        active ? "text-white" : "text-gray-400"
      } hover:scale-105
`}
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}
export default Home;
