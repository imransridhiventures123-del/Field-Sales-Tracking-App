import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ShopVisitCard from "../components/ShopVisitCard";
import TelecallerModal from "../pages/TelecallerModal";
import { generateVisitPDF, downloadPDF, getPDFBlobUrl } from "../utils/pdfGenerator";

const TODAY_VISITS = [
  { _id: "1", shopName: "Annas Provision Store", shopCode: "AP001", ownerName: "Annas", mobile: "9876540001", fieldType: "Field Sales", address: "123 Main Street, Adyar, Chennai - 600020", latitude: 13.0082, longitude: 80.2574, status: "Completed", followUpStatus: "interested", followUp: { status: "interested", date: null }, photos: [1, 2], createdAt: new Date().toISOString() },
  { _id: "2", shopName: "Big Bazaar", shopCode: "BB001", ownerName: "Ravi Kumar", mobile: "9876540002", fieldType: "Collection", address: "456 Anna Salai, Teynampet, Chennai - 600018", latitude: 13.0418, longitude: 80.2341, status: "Completed", followUpStatus: "callback", followUp: { status: "callback", date: new Date(Date.now() + 86400000).toISOString().split("T")[0] }, photos: [1], createdAt: new Date(Date.now() - 1800000).toISOString() },
  { _id: "3", shopName: "Sri Murugan Stores", shopCode: "SM001", ownerName: "Murugan", mobile: "9876540003", fieldType: "Field Sales", address: "789 Gandhi Road, T Nagar, Chennai - 600017", latitude: 13.0418, longitude: 80.2341, status: "Completed", followUpStatus: "order_placed", followUp: { status: "order_placed", date: null }, photos: [], createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "4", shopName: "Kumar Stores", shopCode: "KS001", ownerName: "Suresh Kumar", mobile: "9876540004", fieldType: "Collection", address: "12 West Mambalam, Chennai - 600033", latitude: 13.0339, longitude: 80.2185, status: "Completed", followUpStatus: "payment_due", followUp: { status: "payment_due", date: new Date(Date.now() + 172800000).toISOString().split("T")[0] }, photos: [1], createdAt: new Date(Date.now() - 5400000).toISOString() },
  { _id: "5", shopName: "Daily Fresh Mart", shopCode: "DF001", ownerName: "Rajan", mobile: "9876540005", fieldType: "Field Sales", address: "55 North Usman Road, T Nagar, Chennai - 600017", latitude: 13.0390, longitude: 80.2300, status: "Completed", followUpStatus: "not_interested", followUp: { status: "not_interested", date: null }, photos: [1, 2], createdAt: new Date(Date.now() - 7200000).toISOString() },
];

function getSummary(visits) {
  return {
    total:       visits.length,
    interested:  visits.filter((v) => (v.followUp?.status || v.followUpStatus) === "interested").length,
    callback:    visits.filter((v) => ["callback","busy"].includes(v.followUp?.status || v.followUpStatus)).length,
    orderPlaced: visits.filter((v) => (v.followUp?.status || v.followUpStatus) === "order_placed").length,
    paymentDue:  visits.filter((v) => (v.followUp?.status || v.followUpStatus) === "payment_due").length,
  };
}

// ── WHATSAPP SHARE INSTRUCTIONS MODAL ───────────────────────
// Browser security blocks auto-attaching files to WhatsApp.
// This modal guides the employee to do it manually (2 taps).
function WhatsAppGuideModal({ telecaller, pdfFilename, message, onClose }) {
  const [step, setStep] = useState(1);

  const openWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${telecaller.phone}?text=${encoded}`, "_blank");
    setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6">

        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Send PDF via WhatsApp</h2>
            <p className="text-xs text-gray-400">To: {telecaller.name} (+91 {telecaller.phone})</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                step > s ? "bg-green-500 text-white" : step === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded ${step > s ? "bg-green-400" : "bg-gray-100"}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-2">📥 Step 1 — PDF is already downloaded</p>
              <p className="text-sm text-blue-800">
                Your PDF <span className="font-mono font-semibold text-blue-600">{pdfFilename}</span> was saved to your <span className="font-semibold">Downloads folder</span>.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Next step</p>
              <p className="text-sm text-gray-700">Tap the button below to open WhatsApp. The message is pre-filled. Then attach the PDF manually.</p>
            </div>
            <button
              onClick={openWhatsApp}
              className="w-full py-4 bg-green-500 text-white font-semibold rounded-2xl active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Open WhatsApp to {telecaller.name}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-amber-700 mb-3">📎 Step 2 — Attach the PDF in WhatsApp</p>
              <div className="space-y-3">
                {[
                  { num: "1", text: "In WhatsApp, tap the 📎 (paperclip/attach) icon" },
                  { num: "2", text: 'Select "Document" from the options' },
                  { num: "3", text: `Find and select "${pdfFilename}" from Downloads` },
                  { num: "4", text: "Tap Send — message + PDF will be sent together" },
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {item.num}
                    </div>
                    <p className="text-sm text-amber-800">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl active:scale-[0.98] transition"
            >
              Done — PDF Sent ✓
            </button>
            <button
              onClick={openWhatsApp}
              className="w-full py-3 text-sm text-gray-400 underline"
            >
              Re-open WhatsApp
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">All Done!</h3>
            <p className="text-sm text-gray-500">
              Visit report sent to <span className="font-semibold text-gray-800">{telecaller.name}</span>.
              They will follow up with all shops.
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl active:scale-[0.98] transition"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────
export default function EndOfDayPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showModal, setShowModal]       = useState(false);
  const [generating, setGenerating]     = useState(false);
  const [sentTo, setSentTo]             = useState(null);
  const [pdfFilename, setPdfFilename]   = useState("");
  const [showWAGuide, setShowWAGuide]   = useState(false);
  const [waMessage, setWaMessage]       = useState("");
  const [pdfUrl, setPdfUrl]             = useState(null);

  const summary = getSummary(TODAY_VISITS);
  const today   = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const handleSend = async (telecaller) => {
    setGenerating(true);
    setShowModal(false);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const doc      = generateVisitPDF({ visits: TODAY_VISITS, employee: user, telecaller, date: today });
      const filename = `visit-report-${telecaller.name.replace(/\s/g,"-")}-${new Date().toISOString().split("T")[0]}.pdf`;

      // Download PDF to device
      downloadPDF(doc, filename);
      setPdfUrl(getPDFBlobUrl(doc));
      setPdfFilename(filename);
      setSentTo(telecaller);

      // Pre-build WhatsApp message
      setWaMessage(
        `Hi ${telecaller.name},\n\nPlease find today's visit report for ${new Date().toLocaleDateString("en-IN")}.\n\n` +
        `Summary:\n` +
        `• Total shops visited: ${summary.total}\n` +
        `• Interested: ${summary.interested}\n` +
        `• Call Back: ${summary.callback}\n` +
        `• Orders placed: ${summary.orderPlaced}\n` +
        `• Payment due: ${summary.paymentDue}\n\n` +
        `PDF file: ${filename}\n\n` +
        `Please follow up with all shops. Priority: Interested & Payment Due first.\n\n` +
        `— ${user?.name || "Field Employee"} (${user?.employeeId || ""})`
      );

    } catch (err) {
      console.error("PDF error:", err);
      alert("PDF generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {showModal && (
        <TelecallerModal
          onClose={() => setShowModal(false)}
          onSend={handleSend}
          generating={generating}
        />
      )}

      {showWAGuide && sentTo && (
        <WhatsAppGuideModal
          telecaller={sentTo}
          pdfFilename={pdfFilename}
          message={waMessage}
          onClose={() => setShowWAGuide(false)}
        />
      )}

      {/* Header */}
      <div className="bg-blue-600 px-4 pt-10 pb-6">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-200 text-sm mb-4 active:opacity-70 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Dashboard
        </button>
        <h1 className="text-white text-xl font-bold mb-0.5">End of Day</h1>
        <p className="text-blue-200 text-sm">{today}</p>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4 grid grid-cols-4 gap-2">
        {[
          { label: "Total",    value: summary.total,       color: "text-blue-600"   },
          { label: "Interest", value: summary.interested,  color: "text-green-600"  },
          { label: "Orders",   value: summary.orderPlaced, color: "text-purple-600" },
          { label: "Payment",  value: summary.paymentDue,  color: "text-amber-600"  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* Success banner */}
        {sentTo && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">PDF Downloaded!</p>
                <p className="text-xs text-green-600">Assigned to <span className="font-semibold">{sentTo.name}</span></p>
                <p className="text-[10px] text-green-500 font-mono mt-0.5">{pdfFilename}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Re-download */}
              {pdfUrl && (
                <a href={pdfUrl}
                  download={pdfFilename}
                  className="flex items-center justify-center gap-2 py-3 bg-white border border-green-200 rounded-xl text-sm font-medium text-green-700 active:scale-95 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Download PDF
                </a>
              )}

              {/* WhatsApp with guide */}
              <button
                onClick={() => setShowWAGuide(true)}
                className="flex items-center justify-center gap-2 py-3 bg-green-500 rounded-xl text-sm font-medium text-white active:scale-95 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Send via WhatsApp
              </button>
            </div>

            <button
              onClick={() => { setSentTo(null); setPdfUrl(null); setShowModal(true); }}
              className="w-full mt-2 text-xs text-gray-400 underline text-center">
              Assign to a different telecaller
            </button>
          </div>
        )}

        {/* Visit list */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's Visits ({TODAY_VISITS.length})</p>
        </div>
        <div className="space-y-3">
          {TODAY_VISITS.map((visit) => <ShopVisitCard key={visit._id} visit={visit} />)}
        </div>
      </div>

      {/* Bottom button */}
      {!sentTo && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
          <button
            onClick={() => setShowModal(true)}
            disabled={generating || TODAY_VISITS.length === 0}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base
              bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-200"
          >
            {generating ? (
              <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generating PDF...</>
            ) : (
              <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>Assign to Telecaller & Send PDF</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}