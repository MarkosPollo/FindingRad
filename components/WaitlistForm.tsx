export default function WaitlistForm() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
      <iframe
        src="https://subscribe-forms.beehiiv.com/bb8379d5-911d-46df-a944-3ebea84a1cff"
        data-test-id="beehiiv-embed"
        frameBorder={0}
        scrolling="no"
        style={{
          width: "100%",
          maxWidth: "560px",
          height: "303px",
          margin: "0 auto",
          borderRadius: "20px",
          backgroundColor: "transparent",
          boxShadow: "none",
          display: "block",
        }}
      />
    </div>
  );
}
