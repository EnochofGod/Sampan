// Secret Admin Key to authorize dashboard requests
var ADMIN_KEY = "SAMPAN_ADMIN_2026";

/**
 * Handles GET requests (Public Status Lookup, Get All Applications, Get Courses)
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. ADMIN ROUTE: Get All Applications
    if (action === "getAll") {
      if (params.adminKey !== ADMIN_KEY) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" }, 403);
      }
      var sheet = ss.getSheetByName("Submissions") || ss.getActiveSheet();
      var data = sheet.getDataRange().getValues();
      var applications = [];
      for (var i = 1; i < data.length; i++) {
        applications.push({
          appId: data[i][0],
          timestamp: data[i][1],
          fullName: data[i][2],
          email: data[i][3],
          phone: data[i][4],
          program: data[i][5],
          qualification: data[i][6],
          applicationStatus: data[i][7]
        });
      }
      return createJsonResponse({ status: "success", applications: applications });
    }

    // 2. COURSES ROUTE: Get All Courses (Public or Admin)
    if (action === "getCourses") {
      var courseSheet = ss.getSheetByName("Courses");
      if (!courseSheet) {
        return createJsonResponse({ status: "success", courses: [] });
      }
      var cData = courseSheet.getDataRange().getValues();
      var courses = [];
      for (var j = 1; j < cData.length; j++) {
        courses.push({
          courseId: cData[j][0],
          title: cData[j][1],
          price: cData[j][2],
          description: cData[j][3],
          status: cData[j][4]
        });
      }
      return createJsonResponse({ status: "success", courses: courses });
    }

    // 3. PUBLIC ROUTE: Single Application Lookup
    var searchId = params.appId || params.id || params.search;
    if (searchId) {
      var sheet = ss.getSheetByName("Submissions") || ss.getActiveSheet();
      var data = sheet.getDataRange().getValues();
      for (var k = 1; k < data.length; k++) {
        if (data[k][0] === searchId) {
          return createJsonResponse({
            status: "success",
            appId: data[k][0],
            timestamp: data[k][1],
            fullName: data[k][2],
            email: data[k][3],
            program: data[k][5],
            applicationStatus: data[k][7]
          });
        }
      }
      return createJsonResponse({ error: "Lookup failed" });
    }

    return createJsonResponse({ error: "Invalid action or missing parameters" });
  } catch (err) {
    return createJsonResponse({ error: err.toString() }, 500);
  }
}

/**
 * Handles POST requests (Form Submissions, Admin Status Updates, Course CRUD)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    var action = data.action;

    // --- ADMIN: UPDATE APPLICATION STATUS OR DELETE SUBMISSION ---
    if (action === "updateStatus" || action === "deleteApplication") {
      if (data.adminKey !== ADMIN_KEY) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" }, 403);
      }
      var sheet = ss.getSheetByName("Submissions") || ss.getActiveSheet();
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][0] === data.appId) {
          if (action === "updateStatus") {
            sheet.getRange(i + 1, 8).setValue(data.newStatus || "Pending");
            return createJsonResponse({ status: "success", message: "Status updated successfully" });
          }
          if (action === "deleteApplication") {
            sheet.deleteRow(i + 1);
            return createJsonResponse({ status: "success", message: "Application deleted successfully" });
          }
        }
      }
      return createJsonResponse({ error: "Application ID not found" });
    }

    // --- ADMIN: ADD OR EDIT COURSE ---
    if (action === "saveCourse") {
      if (data.adminKey !== ADMIN_KEY) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" }, 403);
      }
      var courseSheet = ss.getSheetByName("Courses");
      if (!courseSheet) {
        courseSheet = ss.insertSheet("Courses");
        courseSheet.appendRow(["Course ID", "Course Name", "Price", "Description", "Status"]);
      }
      
      var cRows = courseSheet.getDataRange().getValues();
      var courseId = data.courseId || "CRS-" + Math.floor(100 + Math.random() * 900);
      var found = false;

      for (var j = 1; j < cRows.length; j++) {
        if (cRows[j][0] === courseId) {
          courseSheet.getRange(j + 1, 2, 1, 4).setValues([[
            data.title || "",
            data.price || "",
            data.description || "",
            data.status || "Active"
          ]]);
          found = true;
          break;
        }
      }

      if (!found) {
        courseSheet.appendRow([courseId, data.title || "", data.price || "", data.description || "", data.status || "Active"]);
      }

      return createJsonResponse({ status: "success", message: "Course saved successfully" });
    }

    // --- ADMIN: DELETE COURSE ---
    if (action === "deleteCourse") {
      if (data.adminKey !== ADMIN_KEY) {
        return createJsonResponse({ error: "Unauthorized: Invalid Admin Key" }, 403);
      }
      var courseSheet = ss.getSheetByName("Courses");
      if (!courseSheet) {
        return createJsonResponse({ error: "Course sheet not found" });
      }
      var cRows = courseSheet.getDataRange().getValues();
      for (var k = 1; k < cRows.length; k++) {
        if (cRows[k][0] === data.courseId) {
          courseSheet.deleteRow(k + 1);
          return createJsonResponse({ status: "success", message: "Course deleted successfully" });
        }
      }
      return createJsonResponse({ error: "Course ID not found" });
    }

    // --- PUBLIC ACTION: STANDARD FORM SUBMISSION ---
    var sheet = ss.getSheetByName("Submissions") || ss.getActiveSheet();
    var randomNum = Math.floor(1000 + Math.random() * 9000);
    var appId = "CERT-" + new Date().getFullYear() + "-" + randomNum;
    var timestamp = new Date();

    sheet.appendRow([
      appId,                       // Column A: Application ID
      timestamp,                   // Column B: Timestamp
      data.fullName || "",         // Column C: Full Name
      data.email || "",            // Column D: Email
      data.phone || "",            // Column E: Phone Number
      data.program || "",          // Column F: Program
      data.qualification || "",    // Column G: Qualification
      "Pending"                    // Column H: Status
    ]);

    // Send confirmation email if email is provided
    if (data.email) {
      var fullName = data.fullName || data.name || "Applicant";
      var programName = data.program || data.course || "Certification Program";
      var referenceId = appId;
      var subject = "Application Received - " + programName;

      var htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #991b1b; margin: 0;">Sampan Certification Institute</h2>
          </div>
          <p style="font-size: 16px; color: #334155;">Hello <strong>${fullName}</strong>,</p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6;">
            Thank you for applying for the <strong>${programName}</strong>. We have received your submission.
          </p>
          <div style="background-color: #fef2f2; border-left: 4px solid #991b1b; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #7f1d1d;">Application Reference ID:</p>
            <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: bold; color: #1e293b;">${referenceId}</p>
          </div>
          <p style="font-size: 15px; color: #475569;">
            We will review your submission and contact you shortly with the next steps.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #94a3b8; text-align: center;">
            Best regards,<br/>
            <strong>Sampan Certification Institute</strong>
          </p>
        </div>
      `;

      MailApp.sendEmail({
        to: data.email,
        subject: subject,
        htmlBody: htmlBody
      });
    }

    return createJsonResponse({ result: "success", applicationId: appId });

  } catch (error) {
    return createJsonResponse({ result: "error", error: error.toString() }, 500);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper function to generate clean JSON outputs
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}