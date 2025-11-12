
import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side
from datetime import date

def create_mock_excel(filename="mock-excel-sample.xlsx"):
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = "Profiles"

    headers = [
        "First Name", "Middle Name", "Last Name", "Email", "Phone", 
        "DOB (YYYY-MM-DD)", "Gender", "City", "State", "Pincode", 
        "Caste", "Sub-Caste", "Education", "Occupation", "Annual Income", 
        "Father's Name", "Mother's Name", "Siblings", "Bio"
    ]

    # Write headers
    sheet.append(headers)

    # Apply header styling
    header_font = Font(bold=True)
    header_alignment = Alignment(horizontal='center', vertical='center')
    header_border = Border(bottom=Side(style='thin'))
    for col_idx in range(1, len(headers) + 1):
        cell = sheet.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.alignment = header_alignment
        cell.border = header_border

    # Sample data
    data = [
        ["Priya", "Rajesh", "Patil", "priya.patil@example.com", "9876543210", "1995-03-15", "Female", "Pune", "Maharashtra", "411001", "Maratha", "96 Kuli", "BE (CS)", "Software Engineer", "8-10 Lakhs", "Rajesh Patil", "Sunita Patil", "1 brother", "Software engineer, enjoys reading and travel."],
        ["Amit", "Suresh", "Deshmukh", "amit.deshmukh@example.com", "9876543211", "1992-07-20", "Male", "Mumbai", "Maharashtra", "400001", "Brahmin", "Deshastha", "MBA", "Business Analyst", "12-15 Lakhs", "Suresh Deshmukh", "Mangala Deshmukh", "1 sister", "MBA graduate, loves cricket and music."],
        ["Sneha", "Prakash", "Kulkarni", "sneha.kulkarni@example.com", "9876543212", "1996-11-10", "Female", "Nashik", "Maharashtra", "422001", "CKP", "", "B.Com", "Accountant", "4-6 Lakhs", "Prakash Kulkarni", "Vandana Kulkarni", "2 sisters", "Accountant, family-oriented, loves cooking."],
        ["Rahul", "Vijay", "Joshi", "rahul.joshi@example.com", "9876543213", "1993-05-25", "Male", "Pune", "Maharashtra", "411002", "Brahmin", "Karhade", "BE (Mech)", "Mechanical Engineer", "6-8 Lakhs", "Vijay Joshi", "Savita Joshi", "1 brother, 1 sister", "Mechanical engineer, passionate about technology."],
        ["Anjali", "Mohan", "Shinde", "anjali.shinde@example.com", "9876543214", "1994-09-08", "Female", "Nagpur", "Maharashtra", "440001", "Maratha", "", "B.Sc (Biotech)", "Research Scientist", "5-7 Lakhs", "Mohan Shinde", "Lata Shinde", "1 brother", "Research scientist, enjoys gardening and classical dance."],
        ["Sanjay", "Ramesh", "Pawar", "sanjay.pawar@example.com", "9876543215", "1991-12-12", "Male", "Kolhapur", "Maharashtra", "416001", "Maratha", "96 Kuli", "BA (Economics)", "Bank Manager", "10-12 Lakhs", "Ramesh Pawar", "Sushma Pawar", "2 brothers", "Bank manager, values family traditions."],
        # Data for testing updates (same email as Priya Patil)
        ["Priya", "Rajesh", "Patil", "priya.patil@example.com", "9876543210", "1995-03-15", "Female", "Mumbai", "Maharashtra", "400001", "Maratha", "96 Kuli", "ME (CS)", "Senior Software Engineer", "12-15 Lakhs", "Rajesh Patil", "Sunita Patil", "1 brother", "Updated bio: Senior Software Engineer, loves hiking."],
        # Data for testing new entry with phone match
        ["Gauri", "Anil", "Jadhav", "gauri.jadhav@example.com", "9876543210", "1998-01-20", "Female", "Satara", "Maharashtra", "415001", "Maratha", "", "B.Arch", "Architect", "6-8 Lakhs", "Anil Jadhav", "Surekha Jadhav", "0 siblings", "Architect, passionate about design."],
        # Data for testing new entry with name+dob match
        ["Rahul", "Vijay", "Joshi", "rahul.joshi@example.com", "9876543216", "1993-05-25", "Male", "Nagpur", "Maharashtra", "440001", "Brahmin", "Karhade", "ME (Mech)", "Senior Mechanical Engineer", "10-12 Lakhs", "Vijay Joshi", "Savita Joshi", "1 brother, 1 sister", "Updated bio: Senior Mechanical Engineer, enjoys trekking."],
        # Data with missing required fields (should error)
        ["Invalid", "", "", "invalid@example.com", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        # Data with invalid DOB (should error)
        ["BadDate", "", "User", "baddate@example.com", "1234567890", "1900-01-01", "Male", "Pune", "Maharashtra", "411001", "Maratha", "", "Graduate", "Service", "", "", "", "", ""],
        # Data with invalid email format (should error)
        ["BadEmail", "", "User", "bademail", "1234567891", "1990-01-01", "Male", "Pune", "Maharashtra", "411001", "Maratha", "", "Graduate", "Service", "", "", "", "", ""],
        # Data with invalid phone format (should error)
        ["BadPhone", "", "User", "badphone@example.com", "123", "1990-01-01", "Male", "Pune", "Maharashtra", "411001", "Maratha", "", "Graduate", "Service", "", "", "", "", ""],
        # Data with age less than 18 (should error)
        ["Underage", "", "User", "underage@example.com", "1234567892", str(date.today()), "Female", "Pune", "Maharashtra", "411001", "Maratha", "", "Student", "Student", "", "", "", "", ""],
    ]

    for row_data in data:
        sheet.append(row_data)

    # Adjust column widths
    for col in sheet.columns:
        max_length = 0
        column = col[0].column_letter  # Get the column name
        for cell in col:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = (max_length + 2)
        sheet.column_dimensions[column].width = adjusted_width

    workbook.save(filename)
    print(f"Mock Excel file '{filename}' created successfully.")

if __name__ == "__main__":
    create_mock_excel()

