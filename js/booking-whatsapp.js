const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  const dateField = bookingForm.elements.date;
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
  dateField.min = localToday;

  const phoneField = bookingForm.elements.phone;
  phoneField.addEventListener("input", () => phoneField.setCustomValidity(""));

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const digits = phoneField.value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      phoneField.setCustomValidity(
        document.documentElement.lang === "hi"
          ? "कृपया 10 से 15 अंकों का सही मोबाइल नंबर लिखें।"
          : "Enter a valid phone number with 10 to 15 digits."
      );
      phoneField.reportValidity();
      return;
    }

    const language = document.documentElement.lang === "hi" ? "hi" : "en";
    const labels = language === "hi"
      ? {
          title: "नई यात्रा बुकिंग पूछताछ",
          name: "नाम",
          phone: "मोबाइल नंबर",
          category: "यात्रा श्रेणी",
          vehicle: "वाहन की पसंद",
          pickup: "पिकअप स्थान",
          destination: "मंज़िल / ड्रॉप-ऑफ",
          date: "यात्रा की तारीख",
          time: "पिकअप का समय",
          travellers: "यात्रियों की संख्या",
          notes: "अतिरिक्त ज़रूरतें",
          greeting: "नमस्ते, मैं इस यात्रा के लिए बुकिंग की जानकारी चाहता/चाहती हूँ।"
        }
      : {
          title: "New trip booking enquiry",
          name: "Name",
          phone: "Mobile number",
          category: "Trip category",
          vehicle: "Vehicle preference",
          pickup: "Pickup location",
          destination: "Destination / drop-off",
          date: "Travel date",
          time: "Pickup time",
          travellers: "Number of travellers",
          notes: "Additional requirements",
          greeting: "Hello, I would like to enquire about booking this trip."
        };
    const value = (name) => bookingForm.elements[name].value.trim();
    const selected = (name) => bookingForm.elements[name].selectedOptions[0].textContent.trim();
    const details = [
      labels.greeting,
      "",
      `${labels.name}: ${value("name")}`,
      `${labels.phone}: ${value("phone")}`,
      `${labels.category}: ${selected("category")}`,
      `${labels.vehicle}: ${selected("vehicle")}`,
      `${labels.pickup}: ${value("pickup")}`,
      `${labels.destination}: ${value("destination")}`,
      `${labels.date}: ${value("date")}`,
      `${labels.time}: ${value("time")}`,
      `${labels.travellers}: ${value("travellers")}`
    ];
    const notes = value("notes");
    if (notes) details.push(`${labels.notes}: ${notes}`);

    const message = `${labels.title}\n\n${details.join("\n")}`;
    const whatsappUrl = `https://wa.me/918239396673?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;

    const status = document.querySelector("#booking-status");
    status.replaceChildren();
    status.append(document.createTextNode(
      language === "hi"
        ? "WhatsApp में संदेश तैयार है। बुकिंग पूछताछ भेजने के लिए WhatsApp में Send दबाएँ। "
        : "Your message is ready in WhatsApp. Press Send in WhatsApp to submit your booking enquiry. "
    ));
    const fallbackLink = document.createElement("a");
    fallbackLink.href = whatsappUrl;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = language === "hi" ? "WhatsApp खोलें" : "Open WhatsApp";
    status.append(fallbackLink);
  });
}
