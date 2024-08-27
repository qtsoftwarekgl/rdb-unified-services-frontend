/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from 'jspdf';
import "jspdf-autotable";

import img1 from '/certificate/rdb-logo.png'; // Adjust the path as necessary
import img2 from '/certificate/COA.png'; // Adjust the path as necessary
import { getCertificateTitle, getCompanyAddress } from '../utils';
import {Certificate } from '@/types/models/certificate';

const PAGE_MARGIN = 20; // Increased margin
const PAGE_WIDTH = 210; // A4 page width in mm
const PAGE_HEIGHT = 297; // A4 page height in mm
const CONTENT_WIDTH = PAGE_WIDTH - 2 * PAGE_MARGIN;
const CONTENT_HEIGHT = PAGE_HEIGHT - 2 * PAGE_MARGIN;
const INNER_PADDING = 10; // Additional padding inside the border

const CONTENT_MARGIN = 10; // Increased inner margin for more space from edges

export const generateBusAmendmentCertificatePdf = (certificate: Certificate) => {
  const doc: Record<string,any> = new jsPDF();
  // add page numbers

  doc.page=1; // use this as a counter.

function footer(){ 
    doc.setFontSize(10);
    doc.text(170,285, 'Page No: ' + doc.page); //print number bottom right
    doc.page ++;
}
  
  // Function to add borders to the page
  const addBorders = () => {
    doc.setDrawColor(40, 89, 133); // Outer border color
    doc.setLineWidth(1.5);
    doc.rect(PAGE_MARGIN, PAGE_MARGIN, CONTENT_WIDTH, CONTENT_HEIGHT);

    doc.setLineWidth(0.3); // Inner border color
    doc.rect(PAGE_MARGIN + 2, PAGE_MARGIN + 2, CONTENT_WIDTH - 4, CONTENT_HEIGHT - 4);
  };

  addBorders();
  footer();

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
  doc.text(getCertificateTitle(certificate?.certificateType as string, false), PAGE_WIDTH / 2, PAGE_MARGIN + INNER_PADDING + 25, { align: "center" });
  if(certificate?.certificateType?.includes('CESSATION')){
    doc.text("COMPANY", PAGE_WIDTH / 2, PAGE_MARGIN + INNER_PADDING + 30, { align: "center" });
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(128, 128, 128);
  const lowYPosition = certificate?.certificateType?.includes('CESSATION') ? 36 : 30;
  doc.text("Article 23 of Law N° 007/2021 of 05/02/2021 governing companies", PAGE_WIDTH / 2, PAGE_MARGIN + INNER_PADDING + lowYPosition, { align: "center" });

  // Horizontal line
  doc.setLineWidth(0.5);
  doc.setDrawColor(88, 154, 199);
  doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 40, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 40);

  doc.setTextColor(0, 0, 0);

  // ================== BUSINESS INFORMATION ==================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Company Name", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 50);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 30, PAGE_MARGIN + INNER_PADDING + 50);

  doc.setFont("helvetica", "normal");
  doc.text(certificate?.companyName || certificate?.enterpriseName || "", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 60);

  doc.setFont("helvetica", "bold");
  doc.text("Category", PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 50);
  doc.text(":", PAGE_MARGIN + INNER_PADDING + 98, PAGE_MARGIN + INNER_PADDING + 50);

  doc.setFont("helvetica", "normal");
  doc.text(certificate?.category || "", PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 60);

  doc.setFont("helvetica", "bold");
  if(certificate?.certificateType?.includes('DISSOLUTION')){
    doc.text("Dissolution Date", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 70);
    doc.text(":", PAGE_MARGIN + INNER_PADDING + 30, PAGE_MARGIN + INNER_PADDING + 70);
    
    doc.setFont("helvetica", "normal");
    doc.text(certificate?.dissolutionDate, PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 80);
  }
  else if(certificate?.certificateType?.includes('CESSATION')){
    doc.text("Cessation Date", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 70);
    doc.text(":", PAGE_MARGIN + INNER_PADDING + 30, PAGE_MARGIN + INNER_PADDING + 70);
    
    doc.setFont("helvetica", "normal");
    doc.text(certificate?.cessationDate, PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 80);
  }
  else if(certificate?.certificateType?.includes('DORMANCY')){
    doc.text("Date of shareholder resolution", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 70);
    doc.text("to declare dormancy : ", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 75);
    
    doc.setFont("helvetica", "normal");
    doc.text(certificate?.dormancyDeclarationDate || "", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 80);

    doc.setFont("helvetica", "bold");
    doc.text("Start of Dormancy Date : ", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 90);
    
    doc.setFont("helvetica", "normal");
    doc.text(certificate?.startOfDormancyDate || "", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 100);
  }

  doc.setFont("helvetica", "bold");
  doc.text("Filing Date : ", PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 70);

  doc.setFont("helvetica", "normal");
  doc.text(certificate?.filingDate|| "", PAGE_MARGIN + INNER_PADDING + 80, PAGE_MARGIN + INNER_PADDING + 80);

  // ================== BUSINESS ADDRESS ==================

doc.setFontSize(11);
doc.setFont("helvetica", "bold");
doc.text("Registered Address", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 100);

doc.setDrawColor(205, 207, 209);
doc.setLineWidth(0.2);
doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 105, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 105);

doc.setFontSize(10);
doc.setFont("helvetica", "bold");
doc.text("Address : ", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 110);

doc.setFont("helvetica", "normal");
doc.text(getCompanyAddress(certificate), PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 115);

doc.setFont("helvetica", "bold");
doc.text("Email : ", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 110);

doc.setFont("helvetica", "normal");
doc.text(certificate?.registeredOfficeAddress?.email || "", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 115);

doc.setFont("helvetica", "bold");
doc.text("Phone : ", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 125);

doc.setFont("helvetica", "normal");
doc.text(certificate?.registeredOfficeAddress?.phone || "", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 130);

// if there is PO Box add it
if (certificate?.registeredOfficeAddress?.poBox) {
    doc.setFont("helvetica", "bold");
    doc.text("PO Box : ", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 120);

    doc.setFont("helvetica", "normal");
    doc.text(certificate.registeredOfficeAddress?.poBox, PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 125);
}


  // ================== MANAGEMENT DETAILS ==================
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Applicant", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 140);

  doc.setDrawColor(205, 207, 209);
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 145, PAGE_WIDTH - PAGE_MARGIN - INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 145);

  // // Add position 
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Position: ", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 155);

  // // Position name is Managing Director
  doc.setFont("helvetica", "normal");
  doc.text("Managing Director", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 160);

  doc.setFont("helvetica", "bold");
  doc.text("Name : ", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 170);

  doc.setFont("helvetica", "normal");
  const name = certificate?.managingDirector?.name?.replace("null", "") || "";
  doc.text(name, PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 175);


  // doc.setFont("helvetica", "bold");
  // doc.text("ID Document :", PAGE_MARGIN + INNER_PADDING, PAGE_MARGIN + INNER_PADDING + 165);
  
  // doc.setFont("helvetica", "normal");
  // doc.text(certificate?.managingDirector?.documentType?.toUpperCase() || "", PAGE_MARGIN + INNER_PADDING + 25, PAGE_MARGIN + INNER_PADDING + 165);

  doc.setFont("helvetica", "bold");
  doc.text("ID Number: ", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 155);
  
  doc.setFont("helvetica", "normal");
  doc.text(certificate?.managingDirector?.documentId || "", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 160);


  // Address 
  doc.setFont("helvetica", "bold");
  doc.text("Address: ", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 170);

  doc.setFont("helvetica", "normal");
  doc.text(certificate?.managingDirector?.address || "", PAGE_MARGIN + INNER_PADDING + 90, PAGE_MARGIN + INNER_PADDING + 175);



 
    addSignature(doc, certificate);
    // Add text after table of activities
    return doc.output("bloburl");
    }


    const addSignature = (doc: Record<string,any>, certificate: Certificate) => {
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
      if(certificate?.signature){
       doc.addImage(certificate?.signature, 'PNG', signatureX, y, signatureWidth, signatureHeight);
      }
    
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
    
    
    