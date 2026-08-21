import { useEffect, useRef, useState } from "react";
import {
  Apple,
  Battery,
  Bluetooth,
  Calculator,
  Folder,
  Heart,
  Lock,
  Maximize2,
  MessageCircle,
  Music,
  Pause,
  Play,
  Search,
  Settings,
  Share2,
  Speaker,
  Sun,
  Trash2,
  Volume2,
  Wifi,
  X,
} from "lucide-react";

import "./App.css";

const apps = [
  { id: "files", name: "Files", icon: Folder, color: "blue" },
  { id: "music", name: "Music", icon: Music, color: "pink" },
  { id: "tiktok", name: "TikTok", icon: Music, color: "dark" },
  { id: "calculator", name: "Calculator", icon: Calculator, color: "dark" },
  { id: "settings", name: "Settings", icon: Settings, color: "gray" },
  { id: "messages", name: "Messages", icon: MessageCircle, color: "green" },
  { id: "love", name: "Love", icon: Heart, color: "pink" },
];

function App() {
  const [booting, setBooting] = useState(true);
const [locked, setLocked] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setBooting(false);
  }, 2200);

  return () => clearTimeout(timer);
}, []);
  const [openApp, setOpenApp] = useState(null);

  const [windowState, setWindowState] = useState({
    x: 140,
    y: 90,
    width: 760,
    height: 520,
    minimized: false,
    maximized: false,
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [controlCenter, setControlCenter] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef(null);

  /* =========================
     DRAG WINDOW
  ========================= */

  const startDrag = (e) => {
    if (windowState.maximized) return;

    const target = e.target;

    if (
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }

    setIsDragging(true);

    dragOffset.current = {
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      setWindowState((prev) => ({
        ...prev,
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      }));
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  /* =========================
     CLICK SOUND
  ========================= */

  useEffect(() => {
    const audio = new Audio("/click.mp3");

    audio.volume = 0.35;
    audio.preload = "auto";

    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const clickSound = () => {
    if (muted) return;

    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = 0;

    audio.play().catch(() => {});
  };

  const handleClick = (callback) => {
    clickSound();

    if (typeof callback === "function") {
      callback();
    }
  };

  /* =========================
     WINDOW CONTROLS
  ========================= */

  const minimizeWindow = () => {
    handleClick(() => {
      setWindowState((prev) => ({
        ...prev,
        minimized: true,
      }));
    });
  };

  const maximizeWindow = () => {
  handleClick(() => {
    setWindowState((prev) => ({
      ...prev,
      maximized: !prev.maximized,
      minimized: false,
    }));
  });
};

  const restoreWindow = () => {
    handleClick(() => {
      setWindowState((prev) => ({
        ...prev,
        minimized: false,
      }));
    });
  };

  /* =========================
     APP OPEN / CLOSE
  ========================= */

  const open = (appId) => {
    handleClick(() => {
      setOpenApp(appId);
      setControlCenter(false);

      setWindowState((prev) => ({
        ...prev,
        minimized: false,
      }));
    });
  };

  const close = () => {
    handleClick(() => {
      setOpenApp(null);
    });
  };

  return (
    <div className="ipad-page">

      {/* IPAD BODY */}

      <div className="ipad-device">

        {/* CAMERA */}

        <div className="ipad-camera" />

        {/* SCREEN */}

        <div className="ipad-screen">
{booting && (
  <div className="boot-screen">
    <div className="boot-logo">
      <Apple size={48} strokeWidth={1.5} />
    </div>

    <div className="boot-loader">
      <span />
    </div>

    <p>Starting iPad...</p>
  </div>
)}
          {/* =========================
              LIVE WALLPAPER
          ========================= */}

          <div className="wallpaper">

            <video
              className="wallpaper-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src="/wallpaper.mp4"
                type="video/mp4"
              />
            </video>

            <div className="wallpaper-overlay" />

          </div>
{!booting && locked && (
  <div
    className="lock-screen"
    onClick={() => {
      clickSound();
      setLocked(false);
    }}
  >
    <div className="lock-content">

      <div className="lock-icon">
        <Lock size={18} />
      </div>

      <div className="lock-time">
        9:41
      </div>

      <div className="lock-date">
        Thursday, August 20
      </div>

      <div className="lock-message">
        <strong>Copet's iPad</strong>
        <span>Tap anywhere to unlock</span>
      </div>

    </div>

    <div className="lock-bottom">
      <button onClick={(e) => e.stopPropagation()}>
        <Volume2 size={18} />
      </button>

      <div className="lock-indicator" />

      <button onClick={(e) => e.stopPropagation()}>
        <Search size={18} />
      </button>
    </div>
  </div>
)}
          {/* =========================
              IPAD UI
          ========================= */}

          <div className={`ipad-ui ${locked ? "ui-locked" : ""}`}>
            {/* STATUS BAR */}

            <header className="statusbar">

              <div className="status-time">
                9:41
              </div>

              <div className="dynamic-island">
                <span />
              </div>

              <div className="status-icons">
                <Wifi size={14} />
                <Battery size={16} />
              </div>

            </header>

            {/* =========================
                HOME SCREEN
            ========================= */}

            <main className="home-screen">

              <div className="date-widget">
                <span>TUESDAY</span>
                <strong>20 AUGUST</strong>
              </div>

              <div className="welcome-widget">
                <span>WELCOME BACK</span>
                <h1>Copet.</h1>
                <p>Your iPad workspace</p>
              </div>

              {/* APP GRID */}

              <div className="app-grid">

                {apps.map((app) => {
                  const Icon = app.icon;

                  return (
                    <button
                      key={app.id}
                      className="app-item"
                      onClick={() => open(app.id)}
                    >
                      <span
                        className={`app-icon icon-${app.color}`}
                      >
                        <Icon
                          size={27}
                          strokeWidth={1.8}
                        />
                      </span>

                      <span>
                        {app.name}
                      </span>
                    </button>
                  );
                })}

              </div>

              {/* =========================
                  BOTTOM WIDGET
              ========================= */}

              <div className="bottom-widget">

                <div>
                  <span>NOW PLAYING</span>

                  <strong>
                    Ariana Grande
                  </strong>

                  <small>
                    Apple Music
                  </small>
                </div>

                <button
                  onClick={() =>
                    handleClick(() =>
                      setPlaying((prev) => !prev)
                    )
                  }
                >
                  {playing ? (
                    <Pause size={15} />
                  ) : (
                    <Play size={15} />
                  )}
                </button>

              </div>

            </main>

            {/* =========================
                DOCK
            ========================= */}

            <nav className="ipad-dock">

              {apps.slice(0, 5).map((app) => {
                const Icon = app.icon;

                return (
                  <button
                    key={app.id}
                    onClick={() => open(app.id)}
                  >
                    <span
                      className={`dock-icon icon-${app.color}`}
                    >
                      <Icon size={24} />
                    </span>
                  </button>
                );
              })}

              <div className="dock-divider" />

              <button
                onClick={() => open("settings")}
              >
                <span className="dock-icon spotlight">
                  <Search size={23} />
                </span>
              </button>

            </nav>

            {/* =========================
                CONTROL CENTER BUTTON
            ========================= */}

            <button
              className="control-trigger"
              onClick={() =>
                handleClick(() =>
                  setControlCenter((prev) => !prev)
                )
              }
            >
              <span />
              <span />
              <span />
            </button>

            {/* =========================
                CONTROL CENTER
            ========================= */}

            {controlCenter && (
              <div
                className="control-center"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div className="cc-header">

                  <span>
                    Control Center
                  </span>

                  <button
                    onClick={() =>
                      handleClick(() =>
                        setControlCenter(false)
                      )
                    }
                  >
                    <X size={13} />
                  </button>

                </div>

                <div className="cc-grid">

                  {/* CONNECTIVITY */}

                  <div className="cc-card">

                    <div className="connectivity">

                      <button className="cc-button active">
                        <Wifi size={16} />
                      </button>

                      <button className="cc-button">
                        <Bluetooth size={16} />
                      </button>

                    </div>

                    <small>
                      Connectivity
                    </small>

                  </div>

                  {/* BRIGHTNESS */}

                  <div className="cc-card brightness">

                    <Sun size={22} />

                    <div>
                      <span />
                    </div>

                  </div>

                  {/* MUSIC */}

                  <div className="cc-card music-control">

                    <div>

                      <strong>
                        Ariana Grande
                      </strong>

                      <small>
                        Apple Music
                      </small>

                    </div>

                    <button
                      onClick={() =>
                        handleClick(() =>
                          setPlaying(
                            (prev) => !prev
                          )
                        )
                      }
                    >
                      {playing ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                    </button>

                  </div>

                  {/* SOUND */}

                  <div className="cc-card">

                    <button
                      className={`cc-large-button ${
                        muted ? "" : "active"
                      }`}
                      onClick={() =>
                        handleClick(() =>
                          setMuted(
                            (prev) => !prev
                          )
                        )
                      }
                    >
                      {muted ? (
                        <Volume2 size={18} />
                      ) : (
                        <Speaker size={18} />
                      )}
                    </button>

                    <small>
                      {muted
                        ? "Muted"
                        : "Sound"}
                    </small>

                  </div>

                  {/* ROTATION */}

                  <div className="cc-card">

                    <button className="cc-large-button active">
                      <Lock size={18} />
                    </button>

                    <small>
                      Rotation Lock
                    </small>

                  </div>

                </div>

              </div>
            )}

            {/* =========================
                APP WINDOW
            ========================= */}

            {openApp && !windowState.minimized && (
              <div
                className={`app-window ${
                  windowState.maximized
                    ? "window-maximized"
                    : ""
                }`}
                style={
                  windowState.maximized
                    ? undefined
                    : {
                        left: windowState.x,
                        top: windowState.y,
                        width: windowState.width,
                        height: windowState.height,
                      }
                }
              >

                <div
                  className="app-window-header"
                  onMouseDown={startDrag}
                >

                  <div className="window-traffic-lights">

                    <button
  className="traffic close"
  onClick={close}
  aria-label="Close app"
  title="Close"
>
  <X size={12} strokeWidth={2.4} />
  <span className="close-tooltip">Close</span>
</button>

                    <button
                      className="traffic minimize"
                      onClick={minimizeWindow}
                      aria-label="Minimize"
                    >
                      <span />
                    </button>

                    <button
  className={`traffic maximize ${
    windowState.maximized ? "is-maximized" : ""
  }`}
  onClick={maximizeWindow}
  aria-label={
    windowState.maximized
      ? "Restore window"
      : "Fullscreen"
  }
  title={
    windowState.maximized
      ? "Restore"
      : "Fullscreen"
  }
>
  <Maximize2
  size={12}
  strokeWidth={2.4}
  className="maximize-side-icon"
/>

  <span className="fullscreen-tooltip">
    {windowState.maximized ? "Restore" : "Fullscreen"}
  </span>
</button>

                  </div>

                  <div className="window-title">
                    {
                      apps.find(
                        (app) =>
                          app.id === openApp
                      )?.name
                    }
                  </div>

                  <div className="window-header-spacer" />

                </div>

                <div className="app-window-content">

                  {openApp === "files" && (
                    <FilesApp />
                  )}

                  {openApp === "music" && (
                    <MusicApp
                      playing={playing}
                      setPlaying={setPlaying}
                    />
                  )}

                  {openApp === "tiktok" && (
                    <TikTokApp />
                  )}

                  {openApp === "calculator" && (
                    <CalculatorApp />
                  )}

                  {openApp === "settings" && (
                    <SettingsApp />
                  )}

                  {openApp === "messages" && (
                    <MessagesApp />
                  )}

                  {openApp === "love" && (
                    <LoveApp />
                  )}

                </div>

              </div>
            )}

            {/* MINIMIZED WINDOW */}

            {openApp && windowState.minimized && (
              <button
                className="minimized-window"
                onClick={restoreWindow}
              >
                <span>
                  {
                    apps.find(
                      (app) =>
                        app.id === openApp
                    )?.name
                  }
                </span>

                <Maximize2 size={13} />
              </button>
            )}

          </div>

          {/* SCREEN GLASS */}

          <div className="screen-glass" />

        </div>
      </div>
    </div>
  );
}

/* =========================
   FILES APP
========================= */

function FilesApp() {
  const folders = [
    "Projects",
    "Downloads",
    "Documents",
    "Pictures",
    "Games",
    "Music",
    "Videos",
    "Desktop",
  ];

  return (
    <div className="files-app">

      <aside>

        <strong>
          Locations
        </strong>

        <span className="selected-location">
          <Folder size={14} />
          iPad
        </span>

        <span>
          <Folder size={14} />
          Downloads
        </span>

        <span>
          <Folder size={14} />
          Documents
        </span>

        <span>
          <Trash2 size={14} />
          Recently Deleted
        </span>

      </aside>

      <section>

        <div className="files-title">

          <div>
            <small>
              ON MY IPAD
            </small>

            <h2>
              Files
            </h2>
          </div>

          <button>
            <Search size={15} />
          </button>

        </div>

        <div className="folder-grid">

          {folders.map((folder) => (
            <div
              className="folder"
              key={folder}
            >
              <Folder size={35} />
              <span>{folder}</span>
            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

/* =========================
   MUSIC APP
========================= */

function MusicApp({ playing, setPlaying }) {
  const audioRef = useRef(null);

  const songs = [
    {
      title: "Hate That I Made You",
      artist: "Ariana Grande",
      file: "/music/lagu1.mp3",
      cover: "/covers/cover1.jpg",
    },
    {
      title: "We Can Be Friends",
      artist: "Ariana Grande",
      file: "/music/lagu2.mp3",
      cover: "/covers/cover2.jpg",
    },
    {
      title: "Lazy Song",
      artist: "Brono Mars",
      file: "/music/lagu3.mp3",
      cover: "/covers/cover3.jpg",
    },
  ];

  const [currentSong, setCurrentSong] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const song = songs[currentSong];

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = song.file;
    audio.load();

    setProgress(0);
    setDuration(0);

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [playing]);

  const nextSong = () => {
    setCurrentSong((prev) =>
      prev + 1 >= songs.length ? 0 : prev + 1
    );
    setPlaying(true);
  };

  const previousSong = () => {
    setCurrentSong((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
    setPlaying(true);
  };

  const togglePlay = () => {
    setPlaying((prev) => !prev);
  };

  const formatTime = (time) => {
    if (!time || !Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="music3d-screen">

      <audio
        ref={audioRef}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
        }}
        onTimeUpdate={(e) => {
          setProgress(e.currentTarget.currentTime);
        }}
        onEnded={nextSong}
      />

      {/* BACKGROUND */}

      <div className="music3d-background" />

      <div className="music3d-glow glow-one" />
      <div className="music3d-glow glow-two" />

      {/* TOP */}

      <div className="music3d-topbar">
        <div>
          <span>NOW PLAYING</span>
          <strong>Music</strong>
        </div>

        <div className="music3d-equalizer">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>

      {/* 3D ALBUM */}

      <div
        className={`music3d-stage ${
          playing ? "is-playing" : ""
        }`}
      >

        <div className="music3d-orbit orbit-one" />
        <div className="music3d-orbit orbit-two" />

        <div className="music3d-particles">
          {Array.from({ length: 32 }).map((_, i) => (
            <span
              key={i}
              style={{
                "--i": i,
              }}
            />
          ))}
        </div>

        <div className="music3d-cover-wrap">

          <div className="music3d-cover-back" />

          <div className="music3d-cover">
            {song.cover ? (
              <img
                src={song.cover}
                alt={song.title}
              />
            ) : (
              <Music size={70} />
            )}

            <div className="music3d-cover-shine" />
          </div>

        </div>

      </div>

      {/* SONG INFO */}

      <div className="music3d-info">

        <span className="music3d-label">
          {playing ? "PLAYING NOW" : "PAUSED"}
        </span>

        <h1>{song.title}</h1>

        <p>{song.artist}</p>

      </div>

      {/* PROGRESS */}

      <div className="music3d-progress-area">

        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress}
          onChange={(e) => {
            const value = Number(e.target.value);

            if (audioRef.current) {
              audioRef.current.currentTime = value;
            }

            setProgress(value);
          }}
        />

        <div>
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>

      </div>

      {/* CONTROLS */}

      <div className="music3d-controls">

        <button onClick={previousSong}>
          <span>‹</span>
        </button>

        <button
          className="music3d-play"
          onClick={togglePlay}
        >
          {playing ? (
            <Pause size={25} />
          ) : (
            <Play
              size={25}
              fill="currentColor"
            />
          )}
        </button>

        <button onClick={nextSong}>
          <span>›</span>
        </button>

      </div>

      {/* PLAYLIST */}

      <div className="music3d-playlist">

        {songs.map((item, index) => (
          <button
            key={item.file}
            className={
              index === currentSong
                ? "active"
                : ""
            }
            onClick={() => {
              setCurrentSong(index);
              setPlaying(true);
            }}
          >

            <div className="playlist-number">
              {index === currentSong && playing
                ? "♪"
                : String(index + 1).padStart(2, "0")}
            </div>

            <div className="playlist-info">
              <strong>{item.title}</strong>
              <span>{item.artist}</span>
            </div>

            <Music size={15} />

          </button>
        ))}

      </div>

    </div>
  );
}

/* =========================
   CALCULATOR APP
========================= */

function CalculatorApp() {
  const [display, setDisplay] =
    useState("0");

  const [previous, setPrevious] =
    useState(null);

  const [operator, setOperator] =
    useState(null);

  const [waiting, setWaiting] =
    useState(false);

  const inputNumber = (num) => {
    if (waiting) {
      setDisplay(num);
      setWaiting(false);
      return;
    }

    setDisplay((prev) =>
      prev === "0"
        ? num
        : prev + num
    );
  };

  const inputDecimal = () => {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(
        (prev) => prev + "."
      );
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaiting(false);
  };

  const toggleSign = () => {
    if (display === "0") return;

    setDisplay((prev) =>
      prev.startsWith("-")
        ? prev.slice(1)
        : `-${prev}`
    );
  };

  const percentage = () => {
    const value =
      parseFloat(display);

    if (!Number.isNaN(value)) {
      setDisplay(
        String(value / 100)
      );
    }
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;

      case "-":
        return a - b;

      case "×":
        return a * b;

      case "÷":
        return b === 0
          ? "Error"
          : a / b;

      default:
        return b;
    }
  };

  const chooseOperator = (
    nextOperator
  ) => {
    const current =
      parseFloat(display);

    if (Number.isNaN(current))
      return;

    if (
      operator &&
      previous !== null &&
      !waiting
    ) {
      const result =
        calculate(
          previous,
          current,
          operator
        );

      setDisplay(String(result));
      setPrevious(result);
    } else {
      setPrevious(current);
    }

    setOperator(nextOperator);
    setWaiting(true);
  };

  const equals = () => {
    if (
      operator === null ||
      previous === null
    ) {
      return;
    }

    const current =
      parseFloat(display);

    const result =
      calculate(
        previous,
        current,
        operator
      );

    setDisplay(String(result));
    setPrevious(null);
    setOperator(null);
    setWaiting(true);
  };

  const buttons = [
    {
      label: "AC",
      type: "function",
      action: clear,
    },
    {
      label: "±",
      type: "function",
      action: toggleSign,
    },
    {
      label: "%",
      type: "function",
      action: percentage,
    },
    {
      label: "÷",
      type: "operator",
      action: () =>
        chooseOperator("÷"),
    },

    {
      label: "7",
      type: "number",
      action: () =>
        inputNumber("7"),
    },
    {
      label: "8",
      type: "number",
      action: () =>
        inputNumber("8"),
    },
    {
      label: "9",
      type: "number",
      action: () =>
        inputNumber("9"),
    },
    {
      label: "×",
      type: "operator",
      action: () =>
        chooseOperator("×"),
    },

    {
      label: "4",
      type: "number",
      action: () =>
        inputNumber("4"),
    },
    {
      label: "5",
      type: "number",
      action: () =>
        inputNumber("5"),
    },
    {
      label: "6",
      type: "number",
      action: () =>
        inputNumber("6"),
    },
    {
      label: "-",
      type: "operator",
      action: () =>
        chooseOperator("-"),
    },

    {
      label: "1",
      type: "number",
      action: () =>
        inputNumber("1"),
    },
    {
      label: "2",
      type: "number",
      action: () =>
        inputNumber("2"),
    },
    {
      label: "3",
      type: "number",
      action: () =>
        inputNumber("3"),
    },
    {
      label: "+",
      type: "operator",
      action: () =>
        chooseOperator("+"),
    },

    {
      label: "0",
      type: "number zero",
      action: () =>
        inputNumber("0"),
    },
    {
      label: ".",
      type: "number",
      action: inputDecimal,
    },
    {
      label: "=",
      type: "operator",
      action: equals,
    },
  ];

  return (
    <div className="calculator-screen">

      <div className="calculator-display">

        <div
          className={
            display.length > 10
              ? "calculator-number small"
              : "calculator-number"
          }
        >
          {display}
        </div>

      </div>

      <div className="calculator-buttons">

        {buttons.map((button) => (
          <button
            key={button.label}
            className={`calculator-button ${button.type}`}
            onClick={button.action}
          >
            {button.label}
          </button>
        ))}

      </div>

    </div>
  );
}

/* =========================
   TIKTOK APP
========================= */

function TikTokApp() {
  const videos = [
    {
      src: "/videos/tiktok.mp4",
      username: "@Copet",
      caption:
        "My video edit uses After Effects.",
      music:
        "Ariana Grande — yes, and?",
      likes: "1.1K",
      comments: "128",
    },
    {
      src: "/videos/tiktok2.mp4",
      username: "@HLDK",
      caption:
        "pweasee someone i'm beggingg JIAHK",
      music: "HLDK",
      likes: "1M",
      comments: "76",
    },
  ];

  const [current, setCurrent] =
    useState(0);

  const [playing, setPlaying] =
    useState(true);

  const [liked, setLiked] =
    useState(false);

  const [soundOn, setSoundOn] =
    useState(false);

  const videoRef = useRef(null);

  const video = videos[current];

  const toggleVideo = async () => {
  const video = videoRef.current;

  if (!video) return;

  try {
    // Klik pertama → aktifkan suara
    if (!soundOn) {
      video.muted = false;
      video.volume = 1;

      await video.play();

      setSoundOn(true);
      setPlaying(true);
      return;
    }

    // Setelah suara aktif → klik untuk pause/play
    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  } catch (error) {
    console.log("Video audio error:", error);
  }
};

  const nextVideo = () => {
    setCurrent(
      (prev) =>
        (prev + 1) % videos.length
    );

    setLiked(false);
    setPlaying(true);
  };

  const previousVideo = () => {
    setCurrent(
      (prev) =>
        (prev - 1 + videos.length) %
        videos.length
    );

    setLiked(false);
    setPlaying(true);
  };

  return (
    <div
      className="tiktok-screen"
      onClick={toggleVideo}
      onWheel={(e) => {
        if (e.deltaY > 0) {
          nextVideo();
        } else if (e.deltaY < 0) {
          previousVideo();
        }
      }}
    >

      <video
  ref={videoRef}
  className="tiktok-video"
  key={video.src}
  src={video.src}
  autoPlay
  loop
  playsInline
  muted={!soundOn}
  onClick={toggleVideo}
  onLoadedMetadata={() => {
    const el = videoRef.current;

    if (!el) return;

    el.volume = 1;
  }}
  onPlay={() => {
    setPlaying(true);
  }}
  onPause={() => {
    setPlaying(false);
  }}
/>
<button
  className="tiktok-sound-button"
  onClick={async (e) => {
    e.stopPropagation();

    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.muted) {
        video.muted = false;
        video.volume = 1;
        await video.play();
        setSoundOn(true);
      } else {
        video.muted = true;
        setSoundOn(false);
      }
    } catch (error) {
      console.log(error);
    }
  }}
>
  {soundOn ? "🔊" : "🔇"}
</button>


      <div className="tiktok-gradient" />

      {!playing && (
        <div className="tiktok-pause">
          <Play
            size={42}
            fill="white"
          />
        </div>
      )}

      {/* TOP */}

      <div
        className="tiktok-top"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <span>Following</span>
        <strong>For You</strong>
        <Search size={22} />
      </div>

      <div className="tiktok-counter">
        {current + 1} / {videos.length}
      </div>

      {/* BOTTOM */}

      <div
        className="tiktok-bottom"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="tiktok-info">

          <strong>
            {video.username}
          </strong>

          <p>
            {video.caption}
          </p>

          <span>
            ♫ {video.music}
          </span>

        </div>

        <div className="tiktok-actions">

          <div className="tiktok-profile">
            A
          </div>

          <button
            className={
              liked ? "liked" : ""
            }
            onClick={() =>
              setLiked(
                (prev) => !prev
              )
            }
          >
            <Heart
              size={30}
              fill={
                liked
                  ? "currentColor"
                  : "none"
              }
            />

            <small>
              {liked
                ? "1.2K"
                : video.likes}
            </small>
          </button>

          <button>
            <MessageCircle size={29} />

            <small>
              {video.comments}
            </small>
          </button>

          <button>
            <Share2 size={29} />

            <small>
              Share
            </small>
          </button>

          <div className="tiktok-disc">
            <Music size={18} />
          </div>

        </div>

      </div>

      {/* NAVIGATION */}

      <button
        className="tiktok-nav tiktok-prev"
        onClick={(e) => {
          e.stopPropagation();
          previousVideo();
        }}
      >
        ↑
      </button>

      <button
        className="tiktok-nav tiktok-next"
        onClick={(e) => {
          e.stopPropagation();
          nextVideo();
        }}
      >
        ↓
      </button>

      <div className="tiktok-home-indicator" />

    </div>
  );
}

/* =========================
   SETTINGS APP
========================= */

function SettingsApp() {
  const specs = [
  {
    icon: "🖥️",
    label: "Processor",
    value: "Intel Core i7-14700K",
    detail: "20 Cores • 28 Threads • Up to 5.6 GHz",
  },
  {
    icon: "🎮",
    label: "Graphics",
    value: "NVIDIA GeForce RTX 4070 Ti",
    detail: "12 GB GDDR6X",
  },
  {
    icon: "🧠",
    label: "Memory",
    value: "16 GB DDR5",
    detail: "6000 MT/s • 2×8 GB",
  },
  {
    icon: "💾",
    label: "Storage",
    value: "500 GB NVMe SSD",
    detail: "PCIe 4.0",
  },
  {
    icon: "🔌",
    label: "Motherboard",
    value: "B760 ATX",
    detail: "DDR5 • Wi-Fi",
  },
  {
    icon: "❄️",
    label: "Cooling",
    value: "240mm AIO",
    detail: "Liquid Cooling",
  },
  {
    icon: "⚡",
    label: "Power Supply",
    value: "850W 80+ Gold",
    detail: "Fully Modular",
  },
  {
    icon: "🪟",
    label: "Operating System",
    value: "Windows 11 Pro",
    detail: "Developer Workstation",
  },
];

  const coding = [
    "VS Code",
    "React",
    "Vite",
    "JavaScript",
    "Node.js",
    "Git",
  ];

  return (
    <div className="settings-screen">

      {/* PROFILE / PC HEADER */}

      <div className="settings-profile">

        <div className="profile pc-profile">
          💻
        </div>

        <div>
          <strong>MY PC</strong>
          <span>SPEK CODING YANG DIPAKAI</span>
        </div>

        <div className="pc-status">
          <span />
          Online
        </div>

      </div>


      {/* PC SPECS */}

      <div className="settings-group">

        <div className="settings-group-title">
          <span>Hardware</span>
          <small>PC Specifications</small>
        </div>

        <div className="spec-grid">

          {specs.map((spec) => (
            <div
              className="spec-card"
              key={spec.label}
            >

              <div className="spec-icon">
                {spec.icon}
              </div>

              <div className="spec-info">

                <small>{spec.label}</small>

                <strong>
                  {spec.value}
                </strong>

                <span>
                  {spec.detail}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>


      {/* CODING STACK */}

      <div className="settings-group">

        <div className="settings-group-title">
          <span>Development</span>
          <small>Tools & Technologies</small>
        </div>

        <div className="coding-stack">

          {coding.map((item) => (
            <div
              className="coding-item"
              key={item}
            >
              <span className="coding-dot" />
              {item}
            </div>
          ))}

        </div>

      </div>


      {/* WORKSPACE */}

      <div className="settings-group">

        <div className="settings-row">
          <div>
            <span>Workspace</span>
            <small>VS Code</small>
          </div>

          <span className="settings-value">
            Active
          </span>
        </div>

        <div className="settings-row">
          <div>
            <span>Performance</span>
            <small>Optimized for coding</small>
          </div>

          <span className="settings-value green">
            Good
          </span>
        </div>

        <div className="settings-row">
          <div>
            <span>Developer Mode</span>
            <small>Development environment</small>
          </div>

          <span className="settings-toggle active">
            <span />
          </span>
        </div>

      </div>

    </div>
  );
}

/* =========================
   MESSAGES APP
========================= */

function MessagesApp() {
  const initialChats = [
    {
      id: 1,
      name: "Ariana Grande",
      avatar: "A",
      online: true,
      messages: [
        {
          id: 1,
          text: "Heyy 👋",
          mine: false,
        },
        {
          id: 2,
          text: "Codingan Lu bagus bet jir",
          mine: false,
        },
        {
          id: 3,
          text: "Jelas Dong High Quality😎",
          mine: true,
        },
      ],
    },
    {
      id: 2,
      name: "Brono Mars",
      avatar: "H",
      online: true,
      messages: [
        {
          id: 1,
          text: "Brooo",
          mine: false,
        },
        {
          id: 2,
          text: "Mantep Nanti Nyanyi Bareng pet 🔥",
          mine: false,
        },
      ],
    },
    {
      id: 3,
      name: "Taylor Swift",
      avatar: "C",
      online: false,
      messages: [
        {
          id: 1,
          text: "Gua tunggu Di Singapore",
          mine: false,
        },
      ],
    },
  ];

  const [chats, setChats] = useState(initialChats);
  const [selectedId, setSelectedId] = useState(1);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const selectedChat = chats.find(
    (chat) => chat.id === selectedId
  );

  const filteredChats = chats.filter((chat) =>
    chat.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sendMessage = () => {
    const text = message.trim();

    if (!text) return;

    const newMessage = {
      id: Date.now(),
      text,
      mine: true,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                newMessage,
              ],
            }
          : chat
      )
    );

    setMessage("");

    // Auto reply sederhana
    setTimeout(() => {
      const replies = [
        "Okee 😎",
        "Wkwkwk iya",
        "Siapp 🔥",
        "Mantap bro",
        "Nanti gue kabarin 👌",
      ];

      const reply =
        replies[
          Math.floor(
            Math.random() * replies.length
          )
        ];

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: Date.now(),
                    text: reply,
                    mine: false,
                  },
                ],
              }
            : chat
        )
      );
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="messages-app">

      {/* SIDEBAR */}

      <aside className="messages-sidebar">

        <div className="messages-sidebar-top">

          <div>
            <small>MESSAGES</small>
            <h2>Chats</h2>
          </div>

          <button className="messages-new">
            +
          </button>

        </div>

        <div className="messages-search">
          <Search size={15} />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search"
          />
        </div>

        <div className="chat-list">

          {filteredChats.map((chat) => {

            const lastMessage =
              chat.messages[
                chat.messages.length - 1
              ];

            return (
              <button
                key={chat.id}
                className={`chat-item ${
                  selectedId === chat.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedId(chat.id)
                }
              >

                <div className="chat-avatar">
                  {chat.avatar}

                  {chat.online && (
                    <span />
                  )}
                </div>

                <div className="chat-preview">

                  <div>
                    <strong>
                      {chat.name}
                    </strong>

                    <small>
                      9:41
                    </small>
                  </div>

                  <p>
                    {lastMessage?.text}
                  </p>

                </div>

              </button>
            );
          })}

        </div>

      </aside>


      {/* CHAT */}

      <section className="messages-chat">

        {/* HEADER */}

        <header className="messages-header">

          <div className="chat-avatar header-avatar">
            {selectedChat.avatar}

            {selectedChat.online && (
              <span />
            )}
          </div>

          <div>
            <strong>
              {selectedChat.name}
            </strong>

            <small>
              {selectedChat.online
                ? "Online"
                : "Offline"}
            </small>
          </div>

          <button className="messages-header-button">
            <Search size={18} />
          </button>

        </header>


        {/* MESSAGES */}

        <div className="messages-body">

          <div className="messages-date">
            TODAY
          </div>

          {selectedChat.messages.map(
            (msg) => (
              <div
                key={msg.id}
                className={`message-row ${
                  msg.mine
                    ? "mine"
                    : "theirs"
                }`}
              >

                <div className="message-bubble">
                  {msg.text}

                  <small>
                    9:41
                  </small>
                </div>

              </div>
            )
          )}

        </div>


        {/* INPUT */}

        <div className="messages-input-area">

          <button className="message-plus">
            +
          </button>

          <div className="message-input">

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message..."
            />

          </div>

          <button
            className="message-send"
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            ↑
          </button>

        </div>

      </section>

    </div>
  );
}

/* =========================
   LOVE APP
========================= */

function LoveApp() {
  const audioRef = useRef(null);

  const [intro, setIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState("forming");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    // Lagu langsung mulai saat Love dibuka
    if (audio) {
      audio.volume = 1;
      audio.currentTime = 0;

      audio.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }

    // PHASE 1
    const forming = setTimeout(() => {
      setIntroPhase("heart");
    }, 1800);

    // PHASE 2
    const text = setTimeout(() => {
      setIntroPhase("text");
    }, 3000);

    // PHASE 3
    const finish = setTimeout(() => {
      setIntro(false);
    }, 4700);

    return () => {
      clearTimeout(forming);
      clearTimeout(text);
      clearTimeout(finish);

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="love-screen">

      <audio
        ref={audioRef}
        src="/music/love.mp3"
        loop
        preload="auto"
      />

      {/* =========================
          INTRO
      ========================= */}

      {intro && (
        <div className={`love-intro love-phase-${introPhase}`}>

          {/* Background glow */}
          <div className="love-intro-bg" />

          <div className="love-cinematic-flash" />

          {/* Particles */}
          <div className="love-forming-particles">
            {Array.from({ length: 90 }).map((_, i) => (
              <span
                key={i}
                style={{
                  "--i": i,
                  "--angle": `${i * 4}deg`,
                  "--delay": `${(i % 20) * 0.025}s`,
                }}
              />
            ))}
          </div>

          {/* Heart */}
          <div className="love-forming-heart">

            <Heart
              size={155}
              strokeWidth={1.2}
              fill="currentColor"
            />

          </div>

          {/* Heart glow */}
          <div className="love-heart-glow" />

          {/* Text */}
          <div className="love-intro-text">
            <span>I</span>
            <span>LOVE</span>
            <span>YOU</span>
          </div>

          {/* Sparkles */}
          <div className="love-intro-sparkles">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                style={{
                  "--i": i,
                }}
              />
            ))}
          </div>

        </div>
      )}

      {/* =========================
          MAIN LOVE SCREEN
      ========================= */}

      {!intro && (
        <div className="love-main">

          <div className="love-floating-hearts">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                style={{
                  "--i": i,
                  "--left": `${Math.random() * 100}%`,
                  "--duration": `${5 + Math.random() * 5}s`,
                  "--delay": `${Math.random() * 5}s`,
                }}
              >
                ♥
              </span>
            ))}
          </div>

          <div className="love-content">

            <div className="love-big-heart">
              <Heart
                size={82}
                strokeWidth={1.5}
                fill="currentColor"
              />
            </div>

            <h1>I LOVE YOU</h1>

            <p>
              HEALTY ALWAYS ❤️
            </p>

            <button
              className="love-btn"
              onClick={toggleMusic}
            >
              {playing ? (
                <>
                  <Pause size={17} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={17} />
                  Play
                </>
              )}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;