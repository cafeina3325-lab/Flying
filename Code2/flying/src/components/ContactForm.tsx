"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types & Constants ---
type BodyPart = "목" | "어깨" | "가슴" | "배" | "등" | "팔" | "손" | "허리" | "다리" | "발";
const BODY_PARTS: BodyPart[] = ["목", "어깨", "가슴", "배", "등", "팔", "손", "허리", "다리", "발"];

type GenreId =
    | "irezumi"
    | "blackwork"
    | "black_and_grey"
    | "old_school"
    | "lettering"
    | "tribal"
    | "east_asian"
    | "watercolor"
    | "illustration"
    | "mandala"
    | "sak_yant"
    | "other";

const GENRES: { id: GenreId; label: string }[] = [
    { id: "irezumi", label: "이레즈미" },
    { id: "blackwork", label: "블랙워크" },
    { id: "black_and_grey", label: "블랙앤그레이" },
    { id: "old_school", label: "올드스쿨" },
    { id: "lettering", label: "래터링" },
    { id: "tribal", label: "트라이벌" },
    { id: "east_asian", label: "동양화타투" },
    { id: "watercolor", label: "수채화타투" },
    { id: "illustration", label: "일러스트" },
    { id: "mandala", label: "만다라" },
    { id: "sak_yant", label: "싹얀" },
    { id: "other", label: "기타" },
];

const TIME_SLOTS = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

// Mock disabled dates (e.g. admins day off)
const DISABLED_DATES = ["2026-02-10", "2026-02-15"];

// --- Helper Components ---
function StepLabel({ step, title }: { step: number; title: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full border border-gold-soft flex items-center justify-center text-gold-soft text-sm font-bold">
                {step}
            </div>
            <h3 className="text-lg text-white-main tracking-widest uppercase font-medium">
                {title}
            </h3>
        </div>
    );
}

export default function ContactForm() {
    // --- State ---
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const [form, setForm] = useState<{
        bodyPart: BodyPart | null;
        genre: GenreId | null;
        genreOther: string;
        refText: string;
        date: string | null; // YYYY-MM-DD
        time: string | null; // HH:mm
    }>({
        bodyPart: null,
        genre: null,
        genreOther: "",
        refText: "",
        date: null,
        time: null,
    });

    // --- Logic ---
    // Generate next 14 days
    const dates = useMemo(() => {
        const list = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateStr = d.toISOString().split("T")[0];
            list.push({
                dateStr,
                day: d.getDate(),
                dow: ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
                isToday: i === 0,
                isDisabled: DISABLED_DATES.includes(dateStr),
            });
        }
        return list;
    }, []);

    // Filter time slots based on rules
    const availableTimes = useMemo(() => {
        if (!form.date) return [];
        const now = new Date();
        const selectedDate = new Date(form.date);
        const isToday = selectedDate.toDateString() === now.toDateString();

        return TIME_SLOTS.map((slot) => {
            if (!isToday) return { time: slot, disabled: false };

            // +2h rule for today
            const [h, m] = slot.split(":").map(Number);
            const slotDate = new Date(selectedDate);
            slotDate.setHours(h, m, 0, 0);

            const diff = slotDate.getTime() - now.getTime();
            // 2 hours in ms = 2 * 60 * 60 * 1000 = 7200000
            return { time: slot, disabled: diff < 7200000 };
        });
    }, [form.date]);

    const handleSubmit = async () => {
        // Validation with front-end rules
        if (!form.bodyPart) { setErrorMsg("시술 부위를 선택해 주세요."); return; }
        if (!form.genre) { setErrorMsg("장르를 선택해 주세요."); return; }
        if (!form.date || !form.time) { setErrorMsg("상담 희망 날짜와 시간을 선택해 주세요."); return; }

        if (!isLoggedIn) return;

        setStatus("submitting");
        setErrorMsg("");

        // Simulate API
        setTimeout(() => {
            // Random network error simulation (optional, but requested in prompt to have error state)
            // setStatus("error"); setErrorMsg("일시적인 오류로 예약이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.");
            setStatus("success");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-12 rounded-2xl bg-[#3A2A1F]/40 border border-gold-soft/30 backdrop-blur-md text-center max-w-2xl mx-auto"
            >
                <div className="w-16 h-16 rounded-full bg-gold-soft/20 flex items-center justify-center mx-auto mb-6 text-gold-antique">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl text-white-main tracking-widest font-medium mb-4">REQUEST SENT</h2>
                <div className="space-y-4 text-white-muted text-sm leading-relaxed mb-8">
                    <p>접수 완료: 관리자 목록에 등록되며, 동의서 PDF가 자동 생성됩니다.</p>
                    <div className="bg-black/30 p-4 rounded-lg inline-block text-left min-w-[280px]">
                        <p><span className="text-gold-soft">Part:</span> {form.bodyPart}</p>
                        <p><span className="text-gold-soft">Genre:</span> {GENRES.find(g => g.id === form.genre)?.label}</p>
                        <p><span className="text-gold-soft">Date:</span> {form.date} {form.time}</p>
                    </div>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 text-xs tracking-widest transition"
                >
                    RETURN HOME
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-16">

            {/* Step 1: Area */}
            <section className="bg-glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
                <StepLabel step={1} title="AREA" />
                <div className="flex flex-wrap gap-3">
                    {BODY_PARTS.map((part) => (
                        <button
                            key={part}
                            onClick={() => setForm({ ...form, bodyPart: part })}
                            className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 border ${form.bodyPart === part
                                    ? "bg-gold-soft/20 border-gold-soft text-gold-soft shadow-[0_0_15px_rgba(214,190,138,0.2)]"
                                    : "bg-white/5 border-white/10 text-white-muted hover:border-gold-soft/40 hover:text-white-main"
                                }`}
                        >
                            {part}
                        </button>
                    ))}
                </div>
            </section>

            {/* Step 2: Genre */}
            <section className="bg-glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
                <StepLabel step={2} title="GENRE" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {GENRES.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => setForm({ ...form, genre: g.id })}
                            className={`p-4 rounded-xl text-left border transition-all duration-300 ${form.genre === g.id
                                    ? "bg-gold-soft/10 border-gold-soft text-gold-soft"
                                    : "bg-white/5 border-white/10 text-white-muted hover:border-white/30"
                                }`}
                        >
                            <span className="text-sm tracking-wide">{g.label}</span>
                        </button>
                    ))}
                </div>

                {/* Other Textarea */}
                <AnimatePresence>
                    {form.genre === "other" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <textarea
                                value={form.genreOther}
                                onChange={(e) => setForm({ ...form, genreOther: e.target.value })}
                                placeholder="원하시는 방향을 자유롭게 적어 주세요."
                                className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white-main focus:outline-none focus:border-gold-soft/50 resize-none mt-2"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Step 3: Reference */}
            <section className="bg-glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
                <StepLabel step={3} title="REFERENCE" />
                {/* File Upload Placeholder */}
                <div className="border border-dashed border-white/20 rounded-xl p-8 text-center mb-4 hover:border-gold-soft/30 transition-colors cursor-pointer bg-white/[0.02]">
                    <div className="text-gold-antique opacity-50 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-xs text-white-muted tracking-wide">CLICK TO UPLOAD IMAGES</span>
                </div>

                <textarea
                    value={form.refText}
                    onChange={(e) => setForm({ ...form, refText: e.target.value })}
                    placeholder="추가적인 설명이 있다면 적어주세요."
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white-main focus:outline-none focus:border-gold-soft/50 resize-none"
                />
                <p className="mt-3 text-xs text-gold-antique/60 tracking-wide">
                    * 레퍼런스는 참고용이며, 피부/부위에 따라 조정될 수 있습니다.
                </p>
            </section>

            {/* Step 4: Schedule */}
            <section className="bg-glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
                <StepLabel step={4} title="SCHEDULE" />

                {/* Date Grid */}
                <div className="mb-8">
                    <label className="block text-xs text-white-muted uppercase tracking-wider mb-4">Date Selection</label>
                    <div className="grid grid-cols-7 gap-2">
                        {dates.map((d) => (
                            <button
                                key={d.dateStr}
                                disabled={d.isDisabled}
                                onClick={() => setForm({ ...form, date: d.dateStr, time: null })} // Reset time on date change
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all ${form.date === d.dateStr
                                        ? "bg-gold-soft text-sys-black border-gold-soft"
                                        : d.isDisabled
                                            ? "bg-white/5 border-transparent text-white/20 cursor-not-allowed"
                                            : "bg-transparent border-white/10 text-white-muted hover:border-gold-soft/50 hover:text-white-main"
                                    }`}
                            >
                                <span className="text-[10px] uppercase opacity-70 mb-1">{d.dow}</span>
                                <span className="text-lg font-medium">{d.day}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Grid - Show only if date selected */}
                <AnimatePresence>
                    {form.date && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-antique"></span>
                                <label className="text-xs text-white-main tracking-wider">
                                    표시된 시간은 <span className="text-gold-soft">대면 상담 가능 시간</span>입니다.
                                </label>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {availableTimes.map(({ time, disabled }) => (
                                    <button
                                        key={time}
                                        disabled={disabled}
                                        onClick={() => setForm({ ...form, time })}
                                        className={`py-2 rounded-lg text-sm border transition-all ${form.time === time
                                                ? "bg-gold-antique text-black border-gold-antique shadow-lg shadow-gold-antique/20"
                                                : disabled
                                                    ? "bg-white/5 border-transparent text-white/20 cursor-not-allowed line-through decoration-white/20"
                                                    : "bg-[#182320] border-white/10 text-white-main hover:border-gold-soft/40"
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Error Banner */}
            {errorMsg && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-900/40 border border-red-500/30 text-red-100 text-sm text-center rounded-xl"
                >
                    {errorMsg}
                </motion.div>
            )}

            {/* Legal / Confirmation Block */}
            <div className="p-6 rounded-xl bg-[#241A14]/60 border border-[rgba(181,154,90,0.18)] text-center">
                <p className="text-sm text-stone-300 leading-loose break-keep">
                    예약금은 노쇼 방지를 위한 금액이며, 시술비의 일부입니다.<br />
                    <span className="text-gold-soft">입금 확인 후 대면 상담 예약이 확정됩니다.</span><br />
                    고객님의 단순 변심 또는 무단 불참 시 환불되지 않습니다.
                </p>
            </div>


            {/* Gate / Action */}
            <div className="flex flex-col items-center gap-4">
                {isLoggedIn ? (
                    <button
                        onClick={handleSubmit}
                        disabled={status === "submitting"}
                        className="w-full sm:w-auto px-12 py-4 rounded-full bg-gold-antique hover:bg-gold-soft text-[#0B1411] font-bold tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(181,154,90,0.3)] hover:shadow-[0_0_40px_rgba(181,154,90,0.5)] active:scale-95"
                    >
                        {status === "submitting" ? "PROCESSING..." : "SEND REQUEST"}
                    </button>
                ) : (
                    <div className="text-center space-y-4">
                        <p className="text-sm text-white-dim">로그인 후 예약이 가능합니다.</p>
                        <button
                            onClick={() => setIsLoggedIn(true)} // Mock login
                            className="text-gold-soft underline underline-offset-4 text-sm tracking-widest hover:text-white-main"
                        >
                            LOGIN (TEST ONLY)
                        </button>
                    </div>
                )}
            </div>

            {/* Dev Helper - Logged In Toggle */}
            <div className="fixed bottom-4 right-4 opacity-20 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setIsLoggedIn(!isLoggedIn)}
                    className="text-[10px] bg-black/50 px-2 py-1 rounded border border-white/10 text-white"
                >
                    Toggle Auth
                </button>
            </div>

        </div>
    );
}
