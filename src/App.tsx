/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ReactNode } from "react";
import { 
  Search, 
  GraduationCap, 
  Printer, 
  Download, 
  AlertCircle, 
  ChevronLeft,
  BookOpen,
  User,
  Calendar,
  FileText,
  BadgeCheck,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { StudentResult } from "./types.ts";

export default function App() {
  const [rollNo, setRollNo] = useState("");
  const [session, setSession] = useState("Autumn 2024");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState("Roll No");

  const [college, setCollege] = useState("Select All Colleges");
  const [collegeResults, setCollegeResults] = useState<StudentResult[] | null>(null);

  const fetchResult = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!rollNo) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCollegeResults(null);

    try {
      const response = await fetch(`/api/results?rollNo=${rollNo}&session=${session}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Result Not Found");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollegeResult = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (college === "Select All Colleges") {
      setError("Please select a valid college");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCollegeResults(null);

    try {
      const response = await fetch(`/api/college-results?college=${encodeURIComponent(college)}&session=${session}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No results found for this college");
      }
      const data = await response.json();
      setCollegeResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col font-serif select-none print:bg-white overflow-x-hidden">
      {/* Official Header */}
      <header className="bg-[#002147] text-white py-2 print:hidden">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-center relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="w-14 h-14 bg-white rounded-full p-1 border-2 border-orange-500 overflow-hidden shadow-lg">
              <GraduationCap className="w-full h-full text-[#002147]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-widest text-center uppercase drop-shadow-md">
            University of Kashmir
          </h1>
        </div>
      </header>

      {/* Sub-header Banner */}
      <div className="bg-[#f08535] text-white py-1.5 border-t border-white/20 shadow-inner px-4 text-center text-sm md:text-base font-bold print:hidden">
        B. Tech 3rd Semester Regular Batch 2024 and Backlog Batches held in Dec 25 - Jan 26
      </div>

      <div className="flex flex-1 flex-col md:flex-row max-w-[1200px] mx-auto w-full border-x border-slate-300 shadow-2xl bg-white min-h-[80vh]">
        {/* Sidebar */}
        <aside className="w-full md:w-56 bg-[#1a3b5c] text-white shrink-0 print:hidden">
          <div className="bg-[#001f3f] p-3 text-center border-b border-white/10">
            <button 
              onClick={() => {setResult(null); setCollegeResults(null); setError(null);}}
              className="text-white hover:text-orange-400 font-bold tracking-tight flex items-center justify-center gap-2 w-full transition-colors"
            >
              <div className="p-0.5 bg-blue-700/50 rounded border border-blue-500/30">Home</div>
            </button>
          </div>
          <nav className="flex flex-col py-1">
            {[
              "Latest Results",
              "PG Professional",
              "PG Prof Notifications",
              "PG Non-Professional",
              "PG Non-Prof Notifications",
              "UG Professional",
              "UG Prof Notifications",
              "UG Non-Professional",
              "UG Non-Prof Notifications",
              "MBBS",
              "B.E.D.",
              "B.E.D. Notifications",
              "PG Diploma Courses",
              "Certificate Courses",
              "Diploma Courses"
            ].map((item, idx) => (
              <button 
                key={idx}
                className={`text-left px-4 py-2.5 text-xs font-bold border-b border-white/5 hover:bg-[#254d75] transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-[#1e4268]'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#d6e0db] relative flex flex-col p-0.5">
          {/* Form Header Sections */}
          <div className="flex flex-col md:flex-row bg-[#001f3f] text-white print:hidden">
            <div className="flex-1 border-r border-white/10 p-2">
              <h3 className="text-sm font-bold border-b border-white/20 pb-1 mb-2">Select selection criteria</h3>
              <div className="flex gap-4 text-xs">
                {["Roll No", "Name", "Registration No"].map(type => (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer hover:text-orange-400">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === type} 
                      onChange={() => setSearchType(type)}
                      className="accent-orange-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-1 border-r border-white/10 p-2">
              <h3 className="text-sm font-bold border-b border-white/20 pb-1 mb-2">View college result</h3>
              <div className="flex gap-1">
                <select 
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="bg-white text-black text-xs p-1 flex-1 border border-black/50"
                >
                  <option>Select All Colleges</option>
                  <option>IITM Safapora</option>
                  <option>SSM College</option>
                  <option>Kashmir College of Engineering & Technology</option>
                </select>
                <button 
                  onClick={fetchCollegeResult}
                  disabled={loading}
                  className="bg-[#f0f0f0] text-black px-2 py-0.5 text-xs font-bold border border-black/60 shadow-sm active:shadow-inner disabled:opacity-50"
                >
                  View
                </button>
              </div>
              <button 
                onClick={() => {
                  if (collegeResults) window.print();
                }}
                className="bg-[#f0f0f0] text-black px-4 py-0.5 text-xs font-bold border border-black/60 mt-1 shadow-sm active:shadow-inner"
              >
                Print
              </button>
            </div>
            <div className="flex-1 p-2">
              <h3 className="text-sm font-bold border-b border-white/20 pb-1 mb-2">Filter result by marks</h3>
              <div className="flex gap-1 items-center text-xs">
                <span>Marks</span>
                <select className="bg-white text-black p-0.5 border border-black/50">
                  <option>{'>'}</option>
                  <option>{'<'}</option>
                </select>
                <input type="text" className="bg-white text-black border border-black/50 w-16 p-0.5" />
                <button className="bg-[#f0f0f0] text-black px-2 py-0.5 text-xs font-bold border border-black/60">View</button>
              </div>
            </div>
          </div>

          {/* Roll No Search Bar */}
          <div className="bg-[#1a3b5c] p-2 flex items-center gap-4 text-white print:hidden">
            <div className="text-sm font-bold ml-2">Roll No:</div>
            <form onSubmit={fetchResult} className="flex gap-2">
              <input 
                type="text" 
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="241681460xx"
                className="bg-white text-black px-2 py-0.5 text-sm border-2 border-slate-400 focus:border-orange-500 outline-none w-48 font-mono font-bold"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#f0f0f0] hover:bg-white text-black px-4 py-0.5 text-xs font-bold border border-black/60 shadow-sm active:translate-y-px transition-all"
              >
                {loading ? "..." : "Search"}
              </button>
            </form>
          </div>

          {/* Result Display Area */}
          <div className={`flex-1 relative transition-all duration-500 ${!result && !collegeResults && !error ? 'bg-[repeating-linear-gradient(0deg,#d6e0db,#d6e0db_1px,#bdccbc_1px,#bdccbc_2px)]' : 'bg-white p-4 md:p-8'}`}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border-2 border-red-300 p-4 text-red-800 font-bold text-center m-8 shadow-md"
                >
                  {error}
                </motion.div>
              )}

              {collegeResults && !result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="print:p-0"
                >
                  <div className="border-4 border-double border-slate-900 p-4 md:p-6 bg-white shadow-xl relative">
                    <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
                      <h2 className="text-2xl font-black text-[#002147] uppercase leading-tight">{college}</h2>
                      <p className="text-sm font-bold text-slate-700 tracking-wide uppercase">B. Tech 3rd Semester Results (Autumn 2024)</p>
                    </div>
                    
                    <div className="overflow-x-auto border-2 border-slate-900">
                      <table className="w-full text-xs md:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b-2 border-slate-900">
                            <th className="border px-3 py-2 text-left font-bold uppercase">Roll No</th>
                            <th className="border px-3 py-2 text-left font-bold uppercase">Name</th>
                            <th className="border px-3 py-2 text-center font-bold uppercase">Grand Total</th>
                            <th className="border px-3 py-2 text-center font-bold uppercase">Status</th>
                            <th className="border px-3 py-2 text-center font-bold uppercase print:hidden">Action</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium">
                          {collegeResults.map((res) => (
                            <tr key={res.rollNo} className="hover:bg-slate-50 transition-colors">
                              <td className="border px-3 py-2 font-mono font-bold text-slate-700">{res.rollNo}</td>
                              <td className="border px-3 py-2 uppercase tracking-tight">{res.name}</td>
                              <td className="border px-3 py-2 text-center font-bold">{res.grandTotal}</td>
                              <td className={`border px-3 py-2 text-center font-bold text-[10px] uppercase ${res.resultStatus === "Qualified" ? "text-green-700" : "text-red-700"}`}>
                                {res.resultStatus}
                              </td>
                              <td className="border px-3 py-2 text-center print:hidden">
                                <button
                                  onClick={() => setResult(res)}
                                  className="bg-slate-900 text-white px-3 py-1 text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="print:p-0"
                >
                  <div className="border-4 border-double border-slate-900 p-4 md:p-6 bg-white shadow-xl relative">
                    {/* Watermark Logo (Simplified) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none p-20">
                      <GraduationCap className="w-full h-full" />
                    </div>

                    <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
                      <div className="font-serif">
                        <h2 className="text-2xl md:text-3xl font-black text-[#002147] uppercase leading-tight">University of Kashmir</h2>
                        <p className="text-sm font-bold text-slate-700 tracking-wide uppercase">Hazratbal, Srinagar, J&K, 190006</p>
                        <div className="bg-slate-900 text-white px-3 py-1 mt-2 inline-block font-bold text-sm tracking-widest uppercase">
                          Result Memorandum (Provisional)
                        </div>
                      </div>
                      <div className="border-2 border-slate-300 p-2 text-center bg-slate-50">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Serial No.</div>
                        <div className="text-lg font-mono font-black text-slate-900">BT/24/RES/{result.rollNo}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-8 text-sm">
                      <DataRow label="Name of Candidate" value={result.name} />
                      <DataRow label="Parentage" value={result.parentage} />
                      <DataRow label="Roll Number" value={result.rollNo} highlight />
                      <DataRow label="Registration No." value={result.regNo} />
                      <DataRow label="Semester / Batch" value={`${result.semester} (Batch 2024)`} />
                      <DataRow label="Course / Branch" value={`${result.course} (${result.branch})`} />
                      <DataRow label="College" value={result.college} />
                      <DataRow label="Session" value={result.session} />
                    </div>

                    <div className="overflow-x-auto mb-8 border-2 border-slate-900">
                      <table className="w-full text-xs md:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b-2 border-slate-900">
                            <th className="border px-3 py-2 text-left font-bold uppercase">Sub Code</th>
                            <th className="border px-3 py-2 text-left font-bold uppercase">Subject Name</th>
                            <th className="border px-3 py-2 text-center font-bold uppercase">Int.</th>
                            <th className="border px-3 py-2 text-center font-bold uppercase">Ext.</th>
                            <th className="border px-3 py-2 text-center font-bold uppercase">Total</th>
                            <th className="border px-3 py-2 text-center font-bold uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium">
                          {result.subjects.map((sub, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="border px-3 py-2 font-mono font-bold text-slate-700">{sub.code}</td>
                              <td className="border px-3 py-2 uppercase tracking-tight">{sub.name}</td>
                              <td className="border px-3 py-2 text-center">{sub.internal}</td>
                              <td className="border px-3 py-2 text-center">{sub.external}</td>
                              <td className="border px-3 py-2 text-center font-bold">{sub.total}</td>
                              <td className={`border px-3 py-2 text-center font-bold text-[10px] uppercase ${sub.status === "Pass" ? "text-green-700" : "text-red-700 underline"}`}>
                                {sub.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-100 border-t-2 border-slate-900 font-black">
                            <td colSpan={4} className="border px-4 py-3 text-right uppercase tracking-widest text-[#002147]">Grand Total</td>
                            <td className="border px-4 py-3 text-center text-lg">{result.grandTotal}</td>
                            <td className="border bg-white"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-t-4 border-double border-slate-900 pt-6">
                      <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-lg flex-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Result Status</span>
                        <div className={`text-xl md:text-2xl font-black uppercase tracking-tighter ${result.resultStatus === "Qualified" ? "text-green-800" : "text-red-800 underline"}`}>
                          {result.resultStatus}
                        </div>
                      </div>
                      
                      <div className="text-center md:text-right flex flex-col justify-end">
                        <p className="text-[10px] text-slate-500 italic max-w-[280px] ml-auto leading-tight mb-4">
                          Errors and Omissions Excepted. The university reserves the right to rectify any unintentional errors at any stage.
                        </p>
                        <div className="font-serif italic font-black text-slate-900 border-t border-slate-300 pt-1 tracking-tight">
                          - Controller of Examinations -
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] flex justify-between border-t border-slate-100 pt-2">
                      <span>Generated: {new Date().toLocaleString()}</span>
                      <span className="print:hidden">Kashmir University e-Gov Portal v2.4</span>
                    </div>

                    <button 
                      onClick={handlePrint}
                      className="mt-6 w-full py-2 bg-slate-900 text-white font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.99] print:hidden shadow-lg flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Print Statement
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Official Footer */}
      <footer className="bg-[#002147] text-white py-2.5 print:hidden">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold gap-2">
          <div className="flex items-center gap-2">
            <span>© 2010 Directorate of Information Technology & Support System, University of Kashmir</span>
          </div>
          <div className="uppercase tracking-widest text-[#f08535]">
            Managed & Updated by Examination Wing
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoField({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <div className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1">
        {value}
      </div>
    </div>
  );
}

function DataRow({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 border-b border-dotted border-slate-300 pb-1 h-fit">
      <span className="font-bold text-slate-500 uppercase text-[10px] shrink-0 w-32 tracking-wider">{label}:</span>
      <span className={`font-black tracking-tight ${highlight ? 'text-slate-900 text-base border-b-2 border-orange-500' : 'text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}
