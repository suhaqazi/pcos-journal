import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "3.5rem",
        paddingBottom: "4rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        position: "relative",
      }}
    >
      {/* Cream card */}
      <div
        style={{
          backgroundColor: "#FFFDF7",
          borderRadius: "2.5rem",
          maxWidth: "57.875rem",
          width: "100%",
          padding: "4rem 3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Pushpin — top left overlapping card edge */}
        <Image
          src="/pushpin.svg"
          alt=""
          width={80}
          height={100}
          style={{
            position: "absolute",
            top: "-1.5rem",
            left: "-1.2rem",
            zIndex: 10,
            transform: "rotate(-8deg) scaleX(-1)",
            pointerEvents: "none",
          }}
        />

        {/* Pink sticker — top right */}
        <Image
          src="/pinksticker.svg"
          alt=""
          width={400}
          height={80}
          style={{
            position: "absolute",
            top: "-9rem",
            right: "-11rem",
            zIndex: 10,
            transform: "rotate(20deg)",
            pointerEvents: "none",
          }}
        />

        {/* Star beside pink sticker — top right */}
        <Image
          src="/star.svg"
          alt=""
          width={95}
          height={78}
          style={{
            position: "absolute",
            top: "-1rem",
            right: "-2.3rem",
            zIndex: 11,
            pointerEvents: "none",
          }}
        />

        {/* Small star — bottom left */}
        <Image
          src="/star.svg"
          alt=""
          width={110}
          height={70}
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "-3.5rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Button — bottom left */}
        <Image
          src="/button.svg"
          alt=""
          width={100}
          height={70}
          style={{
            position: "absolute",
            bottom: "-2rem",
            left: "-0.5rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Pill label */}
        <div
          style={{
            backgroundColor: "#E9EED9",
            borderRadius: "999px",
            padding: "0.5rem 1.5rem",
            fontSize: "0.875rem",
            fontFamily: "var(--font-figtree)",
            fontWeight: "600",
            color: "#202b0e",
            marginBottom: "2rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Grounded in clinical guidelines
        </div>

        {/* Headline */}
        <div
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
            fontWeight: "700",
            fontSize: "clamp(2rem, 4.5vw, 4.0625rem)",
            lineHeight: "1.1",
            marginBottom: "3rem",
            maxWidth: "48.9375rem",
            position: "relative",
          }}
        >
          <span style={{ color: "#202B0E" }}>Understand your body, </span>
          <span className="underline-doodle" style={{ color: "#6B1F32" }}>
            one page at a time
          </span>
        </div>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "clamp(1rem, 1.3vw, 1.375rem)",
            fontWeight: "100",
            color: "#202B0E",
            maxWidth: "51.6875rem",
            lineHeight: "1.5",
            letterSpacing: "-0.02em",
            marginBottom: "3rem",
          }}
        >
          Ask Orchid is a warm, private place to ask the questions you've been
          holding, write down what your body is doing, and slowly see the
          patterns underneath. No jargon, no judgement - just your own pages,
          taken seriously.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/ask"
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              fontWeight: "600",
              color: "white",
              background: "radial-gradient(circle, #818B56, #383B2F)",
              padding: "0.75rem 2rem",
              borderRadius: "999px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Get Started →
          </Link>

          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              fontWeight: "600",
              color: "#6B1F32",
              backgroundColor: "white",
              border: "0.0625rem solid #6B1F32",
              padding: "0.75rem 2rem",
              borderRadius: "999px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Guest note */}
        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "0.875rem",
            fontWeight: "400",
            color: "#202B0E",
            opacity: 0.8,
          }}
        >
          Not ready for an account?{" "}
          <Link
            href="/ask"
            style={{
              color: "#6B1F32",
              fontWeight: "600",
              textDecoration: "underline",
              textUnderlineOffset: "0.1875rem",
            }}
          >
            Try Ask without an account
          </Link>
        </p>
      </div>
    </section>
  );
}
