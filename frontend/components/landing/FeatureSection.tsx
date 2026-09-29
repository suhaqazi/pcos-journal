export default function FeatureSection() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6rem 1rem 4rem",
      }}
    >
      {/* Main card */}
      <div
        style={{
          backgroundColor: "#FFFDF7",
          borderRadius: "2.5rem",
          maxWidth: "55rem",
          width: "100%",
          padding: "2rem 3rem 3rem",
          textAlign: "center",
          position: "relative",
          marginBottom: "6rem",
        }}
      >
        {/* Corner bracket top left */}
        <img
          src="/corner-bracket.svg"
          alt=""
          style={{
            position: "absolute",
            top: "-0.4rem",
            left: "-1rem",
            width: "6rem",
            height: "6rem",
            pointerEvents: "none",
          }}
        />

        {/* Corner bracket bottom right — rotated */}
        <img
          src="/corner-bracket.svg"
          alt=""
          style={{
            position: "absolute",
            bottom: "-0.4rem",
            right: "-1rem",
            width: "6rem",
            height: "6rem",
            transform: "rotate(180deg)",
            pointerEvents: "none",
          }}
        />

        {/* heading 1 text */}
        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "1rem",
            fontWeight: "300",
            color: "#202B0E",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            lineHeight: "2.5",
          }}
        >
          THREE PAGES, ONE NOTEBOOK
        </p>

        {/* Headline with inline SVG underline under "notice" */}
        <h2
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
            fontWeight: "900",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "#202B0E",
            marginBottom: "1.5rem",
            lineHeight: "1.1",
            letterSpacing: "0.02em",
          }}
        >
          Ask, write, and{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            notice
            <svg
              width="148"
              height="13"
              viewBox="0 0 148 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: "-0.2rem",
                left: 0,
                width: "100%",
                height: "auto",
              }}
            >
              <path
                d="M2 11C3.29945 10.6827 10.9851 8.54149 17.245 7.25179C24.7781 5.69981 36.991 7.6442 42.4263 8.7434C49.4256 10.1589 58.6715 8.72097 71.5551 5.6587C77.3384 4.28408 84.5844 3.05094 92.8811 2.44417C113.902 0.906845 119.398 3.64091 132.264 6.35367C137.722 7.76439 140.837 8.66882 142.62 9.12953C143.505 9.3543 144.351 9.56075 146 9.77345"
                stroke="#6B1F32"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)",
            fontWeight: "300",
            color: "#202B0E",
            maxWidth: "50rem",
            margin: "0 auto",
            lineHeight: "2",
            letterSpacing: "-0.02em",
          }}
        >
          Each part of Ask Orchid does one job well - and they all feed the same
          quiet record of your health.
        </p>
      </div>
      {/* Three feature cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "3.5rem",
          maxWidth: "83rem",
          width: "100%",
          padding: "0 2rem",
        }}
      >
        {/* Card 1 — Ask */}
        <div
          style={{
            backgroundColor: "#FFFDF7",
            borderRadius: "2.5rem",
            padding: "2rem 1.5rem 2rem",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Ask ribbon */}
          <div
            style={{
              position: "absolute",
              top: "-3.5rem",
              left: "-18rem",
              transform: "rotate(-1deg)",
              zIndex: 10,
              pointerEvents: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/ribbon.svg"
              alt=""
              style={{
                width: "40rem",
                height: "9rem",
                display: "block",
                minWidth: "20rem",
              }}
            />
            <span
              style={{
                position: "absolute",
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "900",
                fontSize: "1.3rem",
                transform: "rotate(-35deg)",
                top: "4rem",
                color: "#6B1F32",
              }}
            >
              Ask
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: "900",
              fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
              color: "#6B1F32",
              marginBottom: "0.75rem",
              marginTop: "2rem",
              lineHeight: "1.2",
            }}
          >
            A gentle place to start
          </h3>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              color: "#44403C",
              lineHeight: "1.6",
            }}
          >
            Ask the questions that feel too small or too scary to say out loud.
            You get a warm, plain-language answer - and a nudge toward real care
            when it matters.
          </p>
        </div>

        {/* Card 2 — Journal */}
        <div
          style={{
            backgroundColor: "#FFFDF7",
            borderRadius: "2.5rem",
            padding: "2rem 1.5rem 2rem",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Journal ribbon */}
          <div
            style={{
              position: "absolute",
              top: "-4.5rem",
              left: "-65%",
              transform: "rotate(31deg)",
              zIndex: 10,
              pointerEvents: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/ribbon.svg"
              alt=""
              style={{
                width: "40rem",
                height: "9rem",
                display: "block",
                minWidth: "20rem",
              }}
            />
            <span
              style={{
                position: "absolute",
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "900",
                fontSize: "1.3rem",
                color: "#6B1F32",
                transform: "rotate(-31deg)",
                top: "3.8rem",
                left: "17.5rem",
              }}
            >
              Journal
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: "900",
              fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
              color: "#6B1F32",
              marginBottom: "0.75rem",
              marginTop: "2rem",
              lineHeight: "1.2",
            }}
          >
            A page of your own
          </h3>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              color: "#44403C",
              lineHeight: "1.6",
            }}
          >
            Dated entries with mood and symptom tags, so a hard week becomes a
            pattern you can actually show your clinician.
          </p>
        </div>

        {/* Card 3 — Insights */}
        <div
          style={{
            backgroundColor: "#FFFDF7",
            borderRadius: "2.5rem",
            padding: "2rem 1.5rem 2rem",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Insights ribbon */}
          <div
            style={{
              position: "absolute",
              top: "-3.5rem",
              left: "-65%",
              transform: "rotate(11deg)",
              zIndex: 10,
              pointerEvents: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/ribbon.svg"
              alt=""
              style={{
                width: "40rem",
                height: "9rem",
                display: "block",
                minWidth: "20rem",
                transform: "scaleX(-1) scaleY(-1)",
              }}
            />
            <span
              style={{
                position: "absolute",
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "900",
                fontSize: "1.3rem",
                color: "#6B1F32",
                transform: "rotate(-31deg)",
                top: "3.3rem",
                left: "16.7rem",
              }}
            >
              Insights
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: "900",
              fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
              color: "#6B1F32",
              marginBottom: "0.75rem",
              marginTop: "2rem",
              lineHeight: "1.2",
            }}
          >
            Patterns, not verdicts
          </h3>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              color: "#44403C",
              lineHeight: "1.6",
            }}
          >
            Your moods and symptoms gathered into a calm little chart. No
            scores, no judgement - just what your own pages are telling you.
          </p>
        </div>
      </div>
    </section>
  );
}
