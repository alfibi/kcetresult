import { StudentResult, SubjectResult } from "./types";

export const generateMockData = (): StudentResult[] => {
  const results: StudentResult[] = [];
  const subjects = [
    { code: "MTH-301", name: "Discrete Mathematics" },
    { code: "ECE-302", name: "Digital Electronics" },
    { code: "ECE-303", name: "Digital Electronics Lab" },
    { code: "CSE-304", name: "Database Management Systems (DBMS)" },
    { code: "CSE-305", name: "Database Management Systems (DBMS) Lab" },
    { code: "CSE-306", name: "Object Oriented Programming using C++" },
    { code: "CSE-307", name: "Object Oriented Programming using C++ Lab" },
    { code: "CSE-308", name: "Introduction to Artificial Intelligence" },
  ];

  const studentNames = [
    "MOHAMMAD UZAIR",
    "HASSAAN BIN MAJEED",
    "WAMIQ ABBAS",
    "SYED SABA HAROON ANDRABI",
    "TAHIR BASHIR KHAN",
    "SHAFI NABI RASOOL",
    "MUZAMIL YOUSUF SHEIKH",
    "MUTASIM QURESHI",
    "PEERZADA SHAH FAHAD",
    "CHERANJEEV MUJOO",
    "AJAY KUMAR",
    "KASHIF NISAR",
    "SEERET FATIMA",
    "SAALIF HAMID DARIAL",
    "QADRI IBRAHIM SHAH",
    "RUWAIF AJAZ WANI",
    "MONIS RASHID",
    "IMTIYAZ GUL",
    "MOHAMMAD TIHAME",
    "TOWSEEF AHMAD MALIK",
    "SADIYA MANZOOR",
    "ANDLEEBA MAQBOOL",
    "SHUJAT JAVAID",
    "PEER IDREES ANAYAT",
    "FARAH FIRDOUS NAIK",
    "IMRAN MUSHTAQ",
    "ALI RAZA KHAN",
    "FASIL AMIN",
    "IKHLAQ AHMAD BHAT",
    "AARIBA TAHIR",
    "SYED ASGAR RIZVI",
    "MOHAMMAD ZAYEEM KHAN",
  ];

  const firstNames = ["Aamir", "Zoya", "Ishfaq", "Saba", "Faisal", "Mehak", "Sajid", "Iqra", "Omar", "Aasifa"];
  const lastNames = ["Khan", "Malik", "Dar", "Rather", "Sheikh", "Bhat", "Wani", "Shah", "Lone", "Mir"];

  for (let i = 1; i <= 32; i++) {
    const rollNo = `241681460${i < 10 ? '0' + i : i}`;
    const name = studentNames[i - 1];
    const parentage = `${firstNames[Math.floor(Math.random() * 10)]} ${lastNames[Math.floor(Math.random() * 10)]}`;
    
    const studentSubjects: SubjectResult[] = subjects.map((s, index) => {
      let internal = Math.floor(Math.random() * 11) + 18; // 18-28
      let external = Math.floor(Math.random() * 41) + 20; // 20-60
      
      // Force fail for roll no 24168146023 on first two subjects
      if (rollNo === "24168146023" && index < 2) {
        external = Math.floor(Math.random() * 10) + 10; // 10-19, definite fail
      } else if (rollNo === "24168146023") {
        // Ensure others pass to strictly have "a subject or two failed"
        external = Math.floor(Math.random() * 21) + 40; // 40-60
      }

      const total = internal + external;
      return {
        ...s,
        internal,
        external,
        total,
        status: (total >= 40 && external >= 28 ? "Pass" : "Fail") as "Pass" | "Fail" | "Absent"
      };
    });

    const grandTotal = studentSubjects.reduce((acc, s) => acc + s.total, 0);
    const failedSubjects = studentSubjects.filter(s => s.status === "Fail");
    const resultStatus = failedSubjects.length === 0 ? "Qualified" : `Re-appear in ${failedSubjects.map(s => s.code).join(", ")}`;

    results.push({
      rollNo,
      regNo: `2024-BTECH-${1000 + i}`,
      name,
      parentage,
      session: "Autumn 2024",
      course: "B.Tech",
      branch: "Computer Science & Engineering",
      semester: "3rd Semester",
      college: "Kashmir College of Engineering & Technology",
      subjects: studentSubjects,
      grandTotal,
      resultStatus
    });
  }
  return results;
};

export const mockResults = generateMockData();
