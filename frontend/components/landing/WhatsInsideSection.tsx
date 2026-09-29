import Link from "next/link";

const cards = [
  {
    title: "Questions answered kindly",
    body: "PCOS comes with a lot of noise. Ask anything - from irregular cycles to hair changes to what a diagnosis even means - and get a clear, supportive answer in seconds.",
    link: "Try Ask without an account →",
    href: "/ask",
  },
  {
    title: "A notebook that remembers",
    body: "Write a few lines, tag how you felt, note what your body did. Entries stay private to you and build into a record you can bring to an appointment.",
    link: "Start your journal →",
    href: "/journal",
  },
  {
    title: "See the shape of your weeks",
    body: "Mood and symptom summaries drawn straight from your own entries, so you can spot what helps and what doesn't - without guessing.",
    link: "Look at your insights →",
    href: "/insights",
  },
  {
    title: "Reading you can trust",
    body: "A small, curated shelf of PCOS explainers - symptoms, treatment options, and how to advocate for yourself in a ten-minute appointment.",
    link: "Browse resources →",
    href: "/resources",
  },
];

export default function WhatsInsideSection() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6rem 1rem 4rem",
      }}
    >
      {/* Main card — same width and style as FeatureSection */}
      <div
        style={{
          backgroundColor: "#FFFDF7",
          borderRadius: "2.5rem",
          maxWidth: "55rem",
          width: "100%",
          padding: "1.5rem 3rem 2.3rem",
          textAlign: "center",
          position: "relative",
          marginBottom: "6rem",
        }}
      >
        {/* Top left corner bracket */}
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

        {/* Bottom right corner bracket */}
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

        {/* heading 1 - small */}
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
          WHAT'S INSIDE
        </p>

        {/* Headline with underline under "hard week" */}
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
          Everything a{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            hard week
            <img
              src="/underlinesec2.svg"
              alt=""
              style={{
                position: "absolute",
                bottom: "-0.5rem",
                left: "0",
                width: "110%",
                height: "1.5rem",
              }}
            />
          </span>{" "}
          needs
        </h2>
      </div>

      {/* 2x2 grid — same maxWidth as FeatureSection cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "3rem",
          maxWidth: "82rem",
          width: "100%",
          padding: "0 2rem",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              backgroundColor: "#FFFDF7",
              borderRadius: "2.5rem",
              padding: "1rem 1.9rem 1.5rem",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Red bookmark */}
            <img
              src="/redbookmark.svg"
              alt=""
              style={{
                position: "absolute",
                top: "-4.4rem",
                left: "-3rem",
                width: "12rem",
                height: "auto",
                pointerEvents: "none",
              }}
            />

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "900",
                fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                color: "#202B0E",
                lineHeight: "1.2",
                marginTop: "1.5rem",
              }}
            >
              {card.title}
            </h3>

            {/* Body */}
            <p
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                color: "#44403C",
                lineHeight: "1.6",
                flexGrow: 1,
              }}
            >
              {card.body}
            </p>

            {/* Link */}
            <Link
              href={card.href}
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: "#6B1F32",
                textDecoration: "none",
                marginTop: "0.5rem",
              }}
            >
              {card.link}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
