import { jsPDF } from 'jspdf';
import img1 from '/certificate/rdb-logo.png'; // Adjust the path as necessary
import img2 from '/certificate/COA.png'; // Adjust the path as necessary
import signature from '/certificate/signature.png'; // Adjust the path as necessary
import { getCertificateTitle, getCompanyAddress, getCompanyType } from './utils';
import { ApplicantDetails, BusinessActivitiesCertificate, Certificate, ShareGroup, ShareHolderDetails } from '@/types/models/certificate';

const PAGE_MARGIN = 20; // Increased margin
const PAGE_WIDTH = 210; // A4 page width in mm
const PAGE_HEIGHT = 297; // A4 page height in mm
const CONTENT_WIDTH = PAGE_WIDTH - 2 * PAGE_MARGIN;
const CONTENT_HEIGHT = PAGE_HEIGHT - 2 * PAGE_MARGIN;
const INNER_PADDING = 10; // Additional padding inside the border

const CONTENT_MARGIN = 10; // Increased inner margin for more space from edges
const CONTENT_START_X = PAGE_MARGIN + CONTENT_MARGIN + 2; // Starting X position
const CONTENT_START_Y = PAGE_MARGIN + CONTENT_MARGIN + 10; 

export const generateCertificatePdf = (certificate: Certificate, isFullCertificate:boolean) => {
  const doc = new jsPDF();
  
  // Function to add borders to the page
  const addBorders = () => {
    doc.setDrawColor(40, 89, 133); // Outer border color
    doc.setLineWidth(1.5);
    doc.rect(PAGE_MARGIN, PAGE_MARGIN, CONTENT_WIDTH, CONTENT_HEIGHT);

    doc.setLineWidth(0.3); // Inner border color
    doc.rect(PAGE_MARGIN + 2, PAGE_MARGIN + 2, CONTENT_WIDTH - 4, CONTENT_HEIGHT - 4);
  };

  addBorders();

  // ==================== HEADER ====================
  const img1Width = 40;
  const img1Height = 10;
  const imgWidth = 15;
  const imgHeight = 15;

  // Image 1 (top left corner)
  doc.addImage(img1, 'PNG', PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING, img1Width, img1Height);

  // Image 2 (top right corner)
  doc.addImage(img2, PAGE_WIDTH - PAGE_MARGIN - imgWidth - INNER_PADDING, PAGE_MARGIN + INNER_PADDING, imgWidth, imgHeight);

  // ==================== BODY ====================
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(getCertificateTitle(certificate?.certificateType, isFullCertificate), PAGE_WIDTH / 2, PAGE_MARGIN + INNER_PADDING + 25, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(128, 128, 128);
  doc.text("Article 23 of Law N° 007/2021 of 05/02/2021 governing companies", PAGE_WIDTH / 2, PAGE_MARGIN + INNER_PADDING + 30, { align: "center" });

  // Horizontal line
  doc.setLineWidth(0.5);
  doc.setDrawColor(88, 154, 199);
  doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 40, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 40);

  doc.setTextColor(0, 0, 0);

  // ================== BUSINESS INFORMATION ==================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Registration Date", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 50);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 30, PAGE_MARGIN + INNER_PADDING + 50);

  doc.setFont("helvetica", "normal");
  doc.text(certificate.registrationDate as string, PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 60);

  doc.setFont("helvetica", "bold");
  doc.text("Category", PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 50);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 98, PAGE_MARGIN + INNER_PADDING + 50);

  doc.setFont("helvetica", "normal");
  doc.text(certificate?.category || "", PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 60);

  doc.setFont("helvetica", "bold");
  doc.text("Company Name", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 70);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 30, PAGE_MARGIN + INNER_PADDING + 70);

  doc.setFont("helvetica", "normal");
  doc.text(certificate.companyName, PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 80);

  doc.setFont("helvetica", "bold");
  doc.text("Type", PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 70);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 70);

  doc.setFont("helvetica", "normal");
  doc.text(getCompanyType(certificate?.type || ""), PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 80);

  // ================== BUSINESS ADDRESS ==================

  // should have the same alignment style as the previous section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Registered Address", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 100);

  doc.setDrawColor(205, 207, 209);
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 105, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 105);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Address", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 115);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 15, PAGE_MARGIN + INNER_PADDING + 115);

  doc.setFont("helvetica", "normal");
  doc.text(getCompanyAddress(certificate), PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 125);

  doc.setFont("helvetica", "bold");
  doc.text("Email", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN  + INNER_PADDING + 115);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 100, PAGE_MARGIN + INNER_PADDING + 115);

  doc.setFont("helvetica", "normal");
  doc.text(certificate?.registeredOfficeAddress?.email || "", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 125);

  doc.setFont("helvetica", "bold");
  doc.text("Phone", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 135);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 15, PAGE_MARGIN + INNER_PADDING + 135);

  doc.setFont("helvetica", "normal");
  doc.text(certificate?.registeredOfficeAddress?.phone || "", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 145);


 // if there is PO Box add it
    if(certificate.registeredOfficeAddress?.poBox){
        doc.setFont("helvetica", "bold");
        doc.text("PO Box", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 135);
        doc.text(":", PAGE_MARGIN + INNER_PADDING + 105, PAGE_MARGIN + INNER_PADDING + 135);

        doc.setFont("helvetica", "normal");
        doc.text(certificate.registeredOfficeAddress?.poBox, PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 145);
    }


  // ================== MANAGEMENT DETAILS ==================
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Management Details", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 160);

  doc.setDrawColor(205, 207, 209);
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 165, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 165);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Managing Director", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 175);

  doc.setFont("helvetica", "normal");
  doc.text("Name", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 185);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 10, PAGE_MARGIN + INNER_PADDING + 185);

  const name = certificate?.managingDirector?.name?.replace("null", "") || "";
  doc.text(name, PAGE_MARGIN + INNER_PADDING + 15, PAGE_MARGIN + INNER_PADDING + 185);

  doc.text("ID Document :", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 195);
  doc.text(certificate?.managingDirector?.documentType?.toUpperCase() || "", PAGE_MARGIN + INNER_PADDING + 25, PAGE_MARGIN + INNER_PADDING + 195);

  doc.text("ID Number", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 205);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 10, PAGE_MARGIN + INNER_PADDING + 205);
  doc.text(certificate?.managingDirector?.documentId || "", PAGE_MARGIN + INNER_PADDING + 20, PAGE_MARGIN + INNER_PADDING + 205);


if (isFullCertificate) {
    // ================== ADD MEMBERS OF THE BOARD ==================
    doc.addPage(); // Add a new page for board members
    addBorders();
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Board Members", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 20);
  
    doc.setDrawColor(205, 207, 209);
    doc.setLineWidth(0.2);
    doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 25, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 25);
  
    doc.setFontSize(10);
  
    // Get the page height for boundary checks
    const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
    const BOTTOM_MARGIN = PAGE_MARGIN + INNER_PADDING;
  
    const addBoardMemberDetails = (member: ApplicantDetails, yPos: number) => {
      const baseX = PAGE_MARGIN + INNER_PADDING;
      const baseY = yPos;
  
      doc.setFont("helvetica", "bold");
      doc.text("Name: ", baseX, baseY);
  
      doc.setFont("helvetica", "normal");
      const name = member?.name?.replace("null", "");
      doc.text(name as string, baseX + 20, baseY);
  
      doc.setFont("helvetica", "bold");
      doc.text("ID Document: ", baseX, baseY + 10);
  
      doc.setFont("helvetica", "normal");
      doc.text(member?.documentId || "", baseX + 28, baseY + 10);
  
      doc.setFont("helvetica", "bold");
      doc.text("Address: ", baseX, baseY + 20);
  
      doc.setFont("helvetica", "normal");
      doc.text(member?.address?.replace("null", "") || "", baseX + 20, baseY + 20);
  
      doc.setFont("helvetica", "bold");
      doc.text("Phone number :", baseX, baseY + 30);
  
      doc.setFont("helvetica", "normal");
      doc.text(member?.phoneNumber || "", baseX + 35, baseY + 30);
  
      return baseY + 40; // Return the new Y position for the next member
    };
  
    let currentY = PAGE_MARGIN + INNER_PADDING + 35;
  
    certificate?.membersOfBoard?.forEach((member, index) => {
      if (index > 0) {
        currentY += 10; // Add some space between members
      }
  
      // Check if adding the next member will go beyond the bottom margin
      if (currentY + 50 > PAGE_HEIGHT - BOTTOM_MARGIN) {
        doc.addPage();
        addBorders();
        doc.setFontSize(12);
  
        // Re-add the header for the new page
        doc.setFont("helvetica", "bold");
        doc.text("Board Members", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 20);
  
        doc.setDrawColor(205, 207, 209);
        doc.setLineWidth(0.2);
        doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 25, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 25);
        
        doc.setFontSize(10);
        currentY = PAGE_MARGIN + INNER_PADDING + 35; // Reset Y position for the new page
      }
  
      currentY = addBoardMemberDetails(member, currentY);
    });
    // =============================================================
  
    // ===================== SHARE PER VALUE DETAILS ===============
    // Add a space before the table
    currentY += 20;
  
    // Check if there's enough space on the current page before adding a new page
    if (currentY + 60 > PAGE_HEIGHT - PAGE_MARGIN - INNER_PADDING) { // 60 is an estimated height for the table and content
      doc.addPage();
      addBorders();
      currentY = PAGE_MARGIN + INNER_PADDING + 20; // Reset Y position for the new page
  
      // Re-add the section title and horizontal line
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Share per Value", PAGE_MARGIN + INNER_PADDING, currentY);
  
    //   currentY += 5;
      doc.setDrawColor(205, 207, 209);
      doc.setLineWidth(0.2);
      doc.line(PAGE_MARGIN + INNER_PADDING, currentY, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, currentY);
  
      currentY += 10;
    }
  
    const ROW_HEIGHT = 10; // Base height of each row
    const COL_NO_WIDTH = 10; // Width of "No" column
    const COL_SHARE_GROUP_WIDTH = 40; // Width of "Share Group" column
    const COL_VALUE_PER_SHARE_WIDTH = 30; // Width of "Value Per Share" column
    const COL_NUMBER_OF_SHARES_WIDTH = 40; // Width of "Number of Shares" column
    const COL_SHARE_CAPITAL_WIDTH = 30; // Width of "Share Capital" column
  
    let y = currentY; // Use updated Y position
  
    const startTable = () => {
      // Add header of the section Value per Share
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Share per Value", PAGE_MARGIN + INNER_PADDING, y);

        y += 5;
        doc.setDrawColor(205, 207, 209);
        doc.setLineWidth(0.2);
        doc.line(PAGE_MARGIN + INNER_PADDING, y, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, y);



      // Draw the table headers
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
  
      doc.rect(PAGE_MARGIN + INNER_PADDING, y, COL_NO_WIDTH, ROW_HEIGHT); // "No" column
      doc.text("No", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH, y, COL_SHARE_GROUP_WIDTH, ROW_HEIGHT); // "Share Group" column
      doc.text("Share Group", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH, y, COL_VALUE_PER_SHARE_WIDTH, ROW_HEIGHT); // "Value Per Share" column
      doc.text("Value Per Share", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH, y, COL_NUMBER_OF_SHARES_WIDTH, ROW_HEIGHT); // "Number of Shares" column
      doc.text("Number of Shares", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH, y, COL_SHARE_CAPITAL_WIDTH, ROW_HEIGHT); // "Share Capital" column
      doc.text("Share Capital", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH + COL_SHARE_CAPITAL_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      y += ROW_HEIGHT; // Move y position to the next row
    };
  
    const addRow = (group: ShareGroup, rowIndex: number) => {
      doc.setFont("helvetica", "normal");
  
      // Draw "No" cell
      doc.rect(PAGE_MARGIN + INNER_PADDING, y, COL_NO_WIDTH, ROW_HEIGHT);
      doc.text(String(rowIndex + 1), PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      // Draw "Share Group" cell
      doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH, y, COL_SHARE_GROUP_WIDTH, ROW_HEIGHT);
      doc.text(group.shareGroup, PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);
  
      // Draw "Value Per Share" cell
      doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH, y, COL_VALUE_PER_SHARE_WIDTH, ROW_HEIGHT);
      doc.text(group.valuePerShare.toString(), PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);
  
      // Draw "Number of Shares" cell
      doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH, y, COL_NUMBER_OF_SHARES_WIDTH, ROW_HEIGHT);
      doc.text(group.numberOfShares.toString(), PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);
  
      // Draw "Share Capital" cell
         // Draw "Share Capital" cell
    doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH, y, COL_SHARE_CAPITAL_WIDTH, ROW_HEIGHT);
    doc.text(group.shareCapital.toString(), PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);

    y += ROW_HEIGHT; // Move y position to the next row

    // Check if there is enough space for the next row
    if (y + ROW_HEIGHT > PAGE_HEIGHT - PAGE_MARGIN - INNER_PADDING) {
        doc.addPage();
        addBorders();
        startTable();
        y = PAGE_MARGIN + INNER_PADDING + ROW_HEIGHT; // Reset Y position for the new page
    }
  };

    // Initialize table
    startTable();

    // Add the Share Groups to the table
    certificate?.shareGroups?.forEach((group, index) => {
        addRow(group, index);
    });

    // Add final adjustments, if needed
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    y += 10; //







    // ================== SHARE HOLDER DETAILS ==================
    // Show sharedHolder with their details, no, share holder name, PassportId, share group, number of shares, share capital in a table like that one of share per value
    // Add a space before the table
    // certificate.sharedHolderDetails
     // ================== SHARE HOLDER DETAILS ==================
    // Add a space before the Shareholder Details table
    y += 20; 

    // Check if there's enough space on the current page before adding a new page
    if (y + 60 > PAGE_HEIGHT - PAGE_MARGIN - INNER_PADDING) { // 60 is an estimated height for the table and content
        doc.addPage();
        addBorders();
        y = PAGE_MARGIN + INNER_PADDING + 20; // Reset Y position for the new page

        // Re-add the section title and horizontal line
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Shareholder Details", PAGE_MARGIN + INNER_PADDING, y);

        y += 5;
        doc.setDrawColor(205, 207, 209);
        doc.setLineWidth(0.2);
        doc.line(PAGE_MARGIN + INNER_PADDING, y, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, y);

        y += 10;
    }

    const startShareholderTable = () => {
        // Add header of the section Shareholder Details
        // doc.setFontSize(12);
        // doc.setFont("helvetica", "bold");
        // doc.text("Shareholder Details", PAGE_MARGIN + INNER_PADDING, y);

        // y += 5;
        // doc.setDrawColor(205, 207, 209);
        // doc.setLineWidth(0.2);
        // doc.line(PAGE_MARGIN + INNER_PADDING, y, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, y);

        // Draw the table headers
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");

        doc.rect(PAGE_MARGIN + INNER_PADDING, y, COL_NO_WIDTH, ROW_HEIGHT); // "No" column
        doc.text("No", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });

        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH, y, COL_SHARE_GROUP_WIDTH, ROW_HEIGHT); // "Shareholder Name" column
        doc.text("Name", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });

        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH, y, COL_VALUE_PER_SHARE_WIDTH, ROW_HEIGHT); // "Passport ID" column
        doc.text("Passport ID", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });

        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH, y, COL_NUMBER_OF_SHARES_WIDTH, ROW_HEIGHT); // "Share Group" column
        doc.text("Share Group", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });

        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH, y, COL_SHARE_CAPITAL_WIDTH, ROW_HEIGHT); // "Number of Shares" column
        doc.text("No. of Shares", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH + COL_SHARE_CAPITAL_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });

        y += ROW_HEIGHT; // Move y position to the next row
    };

    const addShareholderRow = (shareholder: ShareHolderDetails, rowIndex: number) => {
        doc.setFont("helvetica", "normal");

        // Draw "No" cell
        doc.rect(PAGE_MARGIN + INNER_PADDING, y, COL_NO_WIDTH, ROW_HEIGHT);
        doc.text(String(rowIndex + 1), PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });

        // Draw "Shareholder Name" cell
        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH, y, COL_SHARE_GROUP_WIDTH, ROW_HEIGHT);
        doc.text(shareholder?.shareHolderName || "", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);

        // Draw "Passport ID" cell
        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH, y, COL_VALUE_PER_SHARE_WIDTH, ROW_HEIGHT);
        doc.text(shareholder?.documentId || "", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);

        // Draw "Share Group" cell
        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH, y, COL_NUMBER_OF_SHARES_WIDTH, ROW_HEIGHT);
        doc.text(shareholder?.shareGroup || "", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);

        // Draw "Number of Shares" cell
        doc.rect(PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH, y, COL_SHARE_CAPITAL_WIDTH, ROW_HEIGHT);
        doc.text(shareholder?.numberOfShares?.toString() || "", PAGE_MARGIN + INNER_PADDING + COL_NO_WIDTH + COL_SHARE_GROUP_WIDTH + COL_VALUE_PER_SHARE_WIDTH + COL_NUMBER_OF_SHARES_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);

        y += ROW_HEIGHT; // Move y position to the next row

        // Check if there is enough space for the next row
        if (y + ROW_HEIGHT > PAGE_HEIGHT - PAGE_MARGIN - INNER_PADDING) {
            doc.addPage();
            addBorders();
            startShareholderTable();
            y = PAGE_MARGIN + INNER_PADDING + ROW_HEIGHT; // Reset Y position for the new page
        }
    };

    // Initialize the Shareholder Details table
    startShareholderTable();

    // Add the Shareholder Details to the table
    console.log("certificate share holders...")
    certificate?.shareHoldersDetails?.forEach((shareholder, index) => {
        addShareholderRow(shareholder, index);
    });

    // Add final adjustments, if needed
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    y += 10;
   }

  const addBusinessActivitiesPage = (activities: BusinessActivitiesCertificate[]) => {
    const ROW_HEIGHT = 10; // Base height of each row
    const COL_NO_WIDTH = 10; // Width of "No" column
    const COL_CODE_WIDTH = 25; // Width of "Code" column
    const COL_DESC_WIDTH = 70; // Width of "Description" column
    const COL_DATE_WIDTH = 40; // Width of "Date" column
  
    const startTable = () => {
      // Draw the table headers
      doc.setFont("helvetica", "bold");
      doc.rect(CONTENT_START_X, y, COL_NO_WIDTH, ROW_HEIGHT); // "No" column
      doc.text("No", CONTENT_START_X + COL_NO_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      doc.rect(CONTENT_START_X + COL_NO_WIDTH, y, COL_CODE_WIDTH, ROW_HEIGHT); // "Code" column
      doc.text("Code", CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      doc.rect(CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH, y, COL_DESC_WIDTH, ROW_HEIGHT); // "Description" column
      doc.text("Description", CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH + COL_DESC_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      doc.rect(CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH + COL_DESC_WIDTH, y, COL_DATE_WIDTH, ROW_HEIGHT); // "Date" column
      doc.text("Date", CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH + COL_DESC_WIDTH + COL_DATE_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      y += ROW_HEIGHT; // Move y position to the next row
    };
  
    const addRow = (activity:BusinessActivitiesCertificate, rowIndex:number) => {
      doc.setFont("helvetica", "normal");
  
      // Split description into lines that fit the column width
      const descriptionLines = doc.splitTextToSize(activity.activityName, COL_DESC_WIDTH);
  
      // Determine the row height based on the number of lines in the description
      const rowHeight = Math.max(ROW_HEIGHT, ROW_HEIGHT * descriptionLines.length);
  
      // Draw "No" cell
      doc.rect(CONTENT_START_X, y, COL_NO_WIDTH, rowHeight);
      doc.text(String(rowIndex + 1), CONTENT_START_X + COL_NO_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      // Draw "Code" cell
      doc.rect(CONTENT_START_X + COL_NO_WIDTH, y, COL_CODE_WIDTH, rowHeight);
      doc.text(activity.activityCode, CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      // Draw "Description" cell
      doc.rect(CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH, y, COL_DESC_WIDTH, rowHeight);
      doc.text(descriptionLines, CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH + 2, y + ROW_HEIGHT / 2 + 2);
  
      // Draw "Date" cell
      doc.rect(CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH + COL_DESC_WIDTH, y, COL_DATE_WIDTH, rowHeight);
      doc.text(activity.date, CONTENT_START_X + COL_NO_WIDTH + COL_CODE_WIDTH + COL_DESC_WIDTH + COL_DATE_WIDTH / 2, y + ROW_HEIGHT / 2 + 2, { align: "center" });
  
      y += rowHeight; // Move y position to the next row
    };
  
    doc.addPage();
    addBorders();
  
    let y = CONTENT_START_Y + 10; // Adjusted starting Y position
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Business Activities", CONTENT_START_X, CONTENT_START_Y);
    
    doc.setDrawColor(205, 207, 209);
    doc.setLineWidth(0.2);
    doc.line(CONTENT_START_X, CONTENT_START_Y + 5, PAGE_WIDTH - PAGE_MARGIN - CONTENT_MARGIN - 2, CONTENT_START_Y + 5);
  
    y += 10;
    startTable(); // Draw the table headers
  
    activities.forEach((activity: BusinessActivitiesCertificate, index:number) => {
      if (y + ROW_HEIGHT > PAGE_HEIGHT - CONTENT_MARGIN - PAGE_MARGIN) { // Check if the content fits on the page
        doc.addPage();
        addBorders();
        y = CONTENT_START_Y + 10; // Reset y position
        // reset table
        doc.setDrawColor(205, 207, 209)
        doc.setLineWidth(0.1)
        startTable(); // Redraw the table headers on the new page
      }
  
      addRow(activity, index);
    });
  };

   if(certificate?.otherBusinessActivities?.length){
    console.log(certificate?.otherBusinessActivities);
    addBusinessActivitiesPage(certificate?.otherBusinessActivities || []);
   }
    addSignature(doc, certificate);
    // Add text after table of activities
    return doc.output("bloburl");
    }


    const addSignature = (doc: any, certificate: Certificate) => {
      const ISSUED_DATE = certificate?.dateOfIssuance;
      const NAME = certificate?.signedBy || "";
      const POSITION = "Management Registrar";
    
      // Define the inner and outer margins
      const INNER_MARGIN = 20;  // Adjust this value based on the inner border
      const OUTER_MARGIN = 20;  // Adjust this value based on the outer border
    
      const y = PAGE_HEIGHT - OUTER_MARGIN - 60; // Position towards the bottom of the page, considering outer margin
      const signatureWidth = 40; // Width of the signature image
      const signatureHeight = 20; // Height of the signature image
    
      // Ensure content stays within the inner margin
      const contentXStart = INNER_MARGIN + CONTENT_MARGIN;
      const contentXEnd = PAGE_WIDTH - INNER_MARGIN - CONTENT_MARGIN;
    
      // Issued date (left side)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Issued date", contentXStart, y + 2);



     // ==============================================================


    
      doc.setFont("helvetica", "normal");
      doc.text(ISSUED_DATE, contentXStart, y + 10);

      // QR code below issued date
    //   const qrCode = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAACFI5MzAAABaklEQVR4Xu2WW2rEMAxFBd6WwFsXaFsG9x6l7aSvr1p/EeMM9gnEkq9uYvuvsO8Ln/GQhxAP+QcJs5F7jVwzBpMmkvrlsrk1kkkXiZExYUtb0aSTjJg73LvJGuzBfXaSgmvsNbMmTaQU8hE/tXOMVMQMlwznx7yBaHFsJLhc2fp9b0cJC5ty6ugMkXQRQ3+67pLImk0EqJXKOOmxJhLmat65k5Tr0kQGtldmMdXFt4oeJoicFlaDaSf67yHXmen5kofW1yvTsySL4UdmJf4moiLyvshwWbnDeki9+ArKKahpF+HQlF9IkLWfLmIYBENNldzTQyT0MgsnVb9nepaopHievRPSbiKXNDTKAl8VPUvCODoeLO8zTq+HEIkpIUnuayLlSLTxxMnzVtGzBPHJXgM7Lyl2kUCGpXo+iG+ddZ5QT6l+k2krkeJtoMcvFT1LgF5eoZpeoIOgEISBy16n10N+jYc8hHjIafIGZcpeKmIduqIAAAAASUVORK5CYII="; // Replace with actual QR code image
      const qrCode = certificate?.qrcode;
      const qrCodeX = contentXStart ;
      const qrCodeY = y + 13;
      doc.addImage(qrCode, qrCodeX, qrCodeY, 30, 30);

      // Serial number
      doc.setFont("helvetica", "bold");
      doc.text("Serial No: ", contentXStart, y + 45);
      doc.setFont("helvetica", "normal");
      doc.text(certificate?.serialNumber?.toString(), contentXStart + 20, y + 45);

    
      // Signature image (right side)
      const signatureX = contentXEnd - signatureWidth;
      doc.addImage(signature, 'PNG', signatureX, y, signatureWidth, signatureHeight);
    
      // Name (below the signature image)
      doc.setFont("helvetica", "bold");
      doc.text(NAME, signatureX + signatureWidth / 2, y + signatureHeight + 10, { align: "center" });
    
      // Position (below the name)
      doc.setFont("helvetica", "normal");
      doc.text(POSITION, signatureX + signatureWidth / 2, y + signatureHeight + 20, { align: "center" });
    
      // Horizontal line below the signature section
      doc.setDrawColor(88, 154, 199);
      doc.setLineWidth(0.5);
      doc.line(contentXStart, y + signatureHeight + 30, contentXEnd, y + signatureHeight + 30);
    };
    
    
    