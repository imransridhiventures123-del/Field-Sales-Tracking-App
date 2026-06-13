import { jsPDF } from "jspdf";

export function generateVisitPDF({ visits, employee, telecaller, date }) {
  const doc    = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  // landscape (297×210mm) gives more width for all columns
  const PAGE_W = 297;
  const MARGIN = 12;
  const COL_W  = PAGE_W - MARGIN * 2;
  let   y      = 18;

  const checkPage = (needed = 12) => {
    if (y + needed > 195) { doc.addPage(); y = 18; }
  };

  // Colors
  const BLUE   = [30, 95, 216];
  const GRAY   = [100, 100, 100];
  const LGRAY  = [240, 242, 245];
  const BLACK  = [30, 30, 30];
  const GREEN  = [22, 163, 74];
  const AMBER  = [217, 119, 6];
  const RED    = [220, 38, 38];
  const PURPLE = [107, 33, 168];

  const fuColor = (s) => {
    if (!s) return GRAY;
    if (["interested","order_placed"].includes(s)) return GREEN;
    if (["callback","busy","payment_due"].includes(s)) return AMBER;
    if (s === "not_interested") return RED;
    return GRAY;
  };

  const fuLabel = (s) => ({
    interested:     "Interested",
    callback:       "Call Back",
    not_interested: "Not Interested",
    busy:           "Busy",
    order_placed:   "Order Placed",
    payment_due:    "Payment Due",
  }[s] || s || "—");

  // ══════════════════════════════════════
  //  HEADER
  // ══════════════════════════════════════
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, PAGE_W, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Maavu Sales Pro", MARGIN, 11);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Field Sales & Distribution — Daily Visit Report", MARGIN, 18);

  doc.setFontSize(9);
  doc.text(
    date || new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    PAGE_W - MARGIN, 11, { align: "right" }
  );
  doc.setFontSize(8);
  doc.text(
    `Generated: ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
    PAGE_W - MARGIN, 18, { align: "right" }
  );

  y = 32;

  // ══════════════════════════════════════
  //  EMPLOYEE + TELECALLER INFO
  // ══════════════════════════════════════
  doc.setFillColor(...LGRAY);
  doc.roundedRect(MARGIN, y, COL_W, 20, 2, 2, "F");

  // Left — employee
  doc.setTextColor(...BLUE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FROM (Field Employee)", MARGIN + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(`Name: ${employee?.name || "—"}`, MARGIN + 4, y + 12);
  doc.text(`ID: ${employee?.employeeId || "—"}   |   Mobile: +91 ${employee?.mobile || "—"}`, MARGIN + 4, y + 17);

  // Divider
  doc.setDrawColor(...GRAY);
  doc.setLineWidth(0.3);
  doc.line(PAGE_W / 2, y + 3, PAGE_W / 2, y + 18);

  // Right — telecaller
  doc.setTextColor(...BLUE);
  doc.setFont("helvetica", "bold");
  doc.text("TO (Telecaller — please follow up)", PAGE_W / 2 + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(`Name: ${telecaller?.name || "—"}`, PAGE_W / 2 + 4, y + 12);
  doc.text(`Mobile: +91 ${telecaller?.phone || "—"}`, PAGE_W / 2 + 4, y + 17);

  y += 24;

  // Visit count line
  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  doc.text(`Total shops visited today: ${visits.length}`, MARGIN, y);
  y += 6;

  // ══════════════════════════════════════
  //  TABLE
  // ══════════════════════════════════════

  // Column definitions — landscape gives us 273mm usable width
  const COLS = [
    { label: "#",            key: "num",        x: MARGIN,      w: 8   },
    { label: "Shop Name",    key: "shopName",   x: MARGIN + 8,  w: 38  },
    { label: "Owner Name",   key: "ownerName",  x: MARGIN + 46, w: 30  },
    { label: "Contact No.",  key: "mobile",     x: MARGIN + 76, w: 30  },  // ← NEW
    { label: "Shop Code",    key: "shopCode",   x: MARGIN + 106,w: 18  },
    { label: "Field Type",   key: "fieldType",  x: MARGIN + 124,w: 24  },
    { label: "Address",      key: "address",    x: MARGIN + 148,w: 46  },  // ← NEW
    { label: "Location",     key: "location",   x: MARGIN + 194,w: 36  },  // ← NEW (GPS lat,lng)
    { label: "Visit Time",   key: "time",       x: MARGIN + 230,w: 22  },
    { label: "Follow-up",    key: "followup",   x: MARGIN + 252,w: 21  },
  ];

  // Table header bar
  doc.setFillColor(...BLUE);
  doc.rect(MARGIN, y, COL_W, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  COLS.forEach((c) => doc.text(c.label, c.x + 1, y + 5.5));
  y += 8;

  // Rows
  visits.forEach((visit, idx) => {
    // Each row is 2 lines tall (14mm) to fit address + followup date
    checkPage(14);

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(MARGIN, y, COL_W, 13, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    const visitTime = visit.createdAt
      ? new Date(visit.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
      : "—";
    const visitDate = visit.createdAt
      ? new Date(visit.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : "";

    const fu     = visit.followUp?.status || visit.followUpStatus || "";
    const fuDate = visit.followUp?.date   || visit.followUpDate   || "";
    const ft     = visit.fieldType || "—";

    // GPS coords
    const lat = visit.latitude  ? visit.latitude.toFixed(4)  : null;
    const lng = visit.longitude ? visit.longitude.toFixed(4) : null;
    const gps = lat && lng ? `${lat},\n${lng}` : "Not captured";

    // Address — truncate to 2 lines
    const addr = (visit.address || "—").slice(0, 40);

    // Row number
    doc.setTextColor(...BLACK);
    doc.text(String(idx + 1), COLS[0].x + 1, y + 5.5);

    // Shop name
    doc.setFont("helvetica", "bold");
    doc.text((visit.shopName || "—").slice(0, 20), COLS[1].x + 1, y + 5.5);
    doc.setFont("helvetica", "normal");

    // Owner
    doc.setTextColor(...BLACK);
    doc.text((visit.ownerName || "—").slice(0, 16), COLS[2].x + 1, y + 5.5);

    // Contact number ← NEW
    doc.setTextColor(...BLUE);
    doc.setFont("helvetica", "bold");
    doc.text(visit.mobile ? `+91 ${visit.mobile}` : "—", COLS[3].x + 1, y + 5.5);
    doc.setFont("helvetica", "normal");

    // Shop code
    doc.setTextColor(...BLACK);
    doc.text((visit.shopCode || "—").slice(0, 8), COLS[4].x + 1, y + 5.5);

    // Field type
    doc.setTextColor(ft === "Field Sales" ? BLUE[0] : PURPLE[0],
                     ft === "Field Sales" ? BLUE[1] : PURPLE[1],
                     ft === "Field Sales" ? BLUE[2] : PURPLE[2]);
    doc.setFont("helvetica", "bold");
    doc.text(ft.slice(0, 12), COLS[5].x + 1, y + 5.5);
    doc.setFont("helvetica", "normal");

    // Address ← NEW (2 lines)
    doc.setTextColor(...BLACK);
    doc.setFontSize(6.5);
    const addrLine1 = addr.slice(0, 24);
    const addrLine2 = addr.slice(24, 44);
    doc.text(addrLine1, COLS[6].x + 1, y + 4.5);
    if (addrLine2) doc.text(addrLine2, COLS[6].x + 1, y + 9);

    // GPS location ← NEW
    doc.setTextColor(...GRAY);
    doc.setFontSize(6.5);
    if (lat && lng) {
      doc.text(`${lat},`, COLS[7].x + 1, y + 4.5);
      doc.text(`${lng}`, COLS[7].x + 1, y + 9);
    } else {
      doc.text("Not captured", COLS[7].x + 1, y + 5.5);
    }

    // Time
    doc.setTextColor(...BLACK);
    doc.setFontSize(7.5);
    doc.text(visitTime,  COLS[8].x + 1, y + 4.5);
    doc.text(visitDate,  COLS[8].x + 1, y + 9);

    // Follow-up status
    doc.setTextColor(...fuColor(fu));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(fuLabel(fu).slice(0, 11), COLS[9].x + 1, y + 4.5);

    // Follow-up date
    if (fuDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...GRAY);
      const fd = new Date(fuDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      doc.text(`By: ${fd}`, COLS[9].x + 1, y + 9);
    }

    // Row bottom border
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, y + 13, MARGIN + COL_W, y + 13);

    y += 13;
  });

  // ══════════════════════════════════════
  //  SUMMARY BOX
  // ══════════════════════════════════════
  checkPage(28);
  y += 5;

  const interested = visits.filter((v) => (v.followUp?.status || v.followUpStatus) === "interested").length;
  const callbacks  = visits.filter((v) => ["callback","busy"].includes(v.followUp?.status || v.followUpStatus)).length;
  const orders     = visits.filter((v) => (v.followUp?.status || v.followUpStatus) === "order_placed").length;
  const payments   = visits.filter((v) => (v.followUp?.status || v.followUpStatus) === "payment_due").length;
  const notInt     = visits.filter((v) => (v.followUp?.status || v.followUpStatus) === "not_interested").length;

  doc.setFillColor(...LGRAY);
  doc.roundedRect(MARGIN, y, COL_W, 22, 2, 2, "F");

  doc.setTextColor(...BLACK);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Summary for Telecaller", MARGIN + 3, y + 7);

  const summaryItems = [
    { label: `Interested: ${interested}`,    color: GREEN  },
    { label: `Call Back: ${callbacks}`,      color: AMBER  },
    { label: `Order Placed: ${orders}`,      color: PURPLE },
    { label: `Payment Due: ${payments}`,     color: RED    },
    { label: `Not Interested: ${notInt}`,    color: GRAY   },
    { label: `Total Visits: ${visits.length}`, color: BLUE },
  ];

  summaryItems.forEach((item, i) => {
    doc.setTextColor(...item.color);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(item.label, MARGIN + 3 + (i * 46), y + 15);
  });

  doc.setTextColor(...GRAY);
  doc.setFontSize(7);
  doc.text(
    `Telecaller: Please call each shop at the number listed. Priority: Interested & Payment Due shops first.`,
    MARGIN + 3, y + 20
  );

  // ══════════════════════════════════════
  //  FOOTER on every page
  // ══════════════════════════════════════
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...BLUE);
    doc.rect(0, 202, PAGE_W, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text("Maavu Sales Pro — Confidential. For internal use only.", MARGIN, 207);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, 207, { align: "right" });
  }

  return doc;
}

export function downloadPDF(doc, filename) {
  doc.save(filename || "visit-report.pdf");
}

export function getPDFBlobUrl(doc) {
  return URL.createObjectURL(doc.output("blob"));
}