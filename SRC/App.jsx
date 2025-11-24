import React, { useState } from "react";

export default function RescueFormApp() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    hotel: "",
    room: "",
    pax: "",
    ages: "",
    babyElderly: "",
    phone: "",
    supplies: "",
    power: "",
    medical: "",
    evacuation: "",
    nationality: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEntries([...entries, { ...form, id: Date.now(), timestamp: new Date().toLocaleString() }]);
    setForm({
      hotel: "",
      room: "",
      pax: "",
      ages: "",
      babyElderly: "",
      phone: "",
      supplies: "",
      power: "",
      medical: "",
      evacuation: "",
      nationality: "",
    });
    alert("Registration submitted successfully!");
  };

  const exportToGoogleSheets = () => {
    if (entries.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Timestamp", "Hotel", "Room", "Pax", "Ages", "Baby/Elderly", "Phone", "Supplies", "Power", "Medical", "Evacuation", "Nationality"];
    
    const csvContent = [
      headers.join(","),
      ...entries.map(entry => [
        `"${entry.timestamp}"`,
        `"${entry.hotel}"`,
        `"${entry.room}"`,
        `"${entry.pax}"`,
        `"${entry.ages}"`,
        `"${entry.babyElderly}"`,
        `"${entry.phone}"`,
        `"${entry.supplies}"`,
        `"${entry.power}"`,
        `"${entry.medical}"`,
        `"${entry.evacuation}"`,
        `"${entry.nationality}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "hatyai_rescue_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateQRCode = () => {
    const currentUrl = window.location.href;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
    
    return (
      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-2">Share this App</h3>
        <p className="text-sm text-gray-600 mb-2">Scan this QR code to access the rescue registry:</p>
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          className="mx-auto border rounded"
        />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Or share this link: <br />
          <span className="break-all">{currentUrl}</span>
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Hatyai Flood Rescue Registry</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button 
          onClick={exportToGoogleSheets}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <span>📥</span> Export to Google Sheets
        </button>
        
        <button 
          onClick={() => {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl);
            alert("App link copied to clipboard!");
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <span>🔗</span> Copy App Link
        </button>
      </div>

      {generateQRCode()}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 mt-6">
        <input className="p-2 border rounded" placeholder="Hotel Name *" name="hotel" value={form.hotel} onChange={handleChange} required />
        <input className="p-2 border rounded" placeholder="Room Number *" name="room" value={form.room} onChange={handleChange} required />
        <input className="p-2 border rounded" placeholder="Number of Pax *" name="pax" value={form.pax} onChange={handleChange} required />
        <input className="p-2 border rounded" placeholder="Ages (e.g., 35,42,8)" name="ages" value={form.ages} onChange={handleChange} />
        <input className="p-2 border rounded" placeholder="Baby/Elderly (yes/no)" name="babyElderly" value={form.babyElderly} onChange={handleChange} />
        <input className="p-2 border rounded" placeholder="Phone Number *" name="phone" value={form.phone} onChange={handleChange} required />
        <input className="p-2 border rounded" placeholder="Water/Food Left (days)" name="supplies" value={form.supplies} onChange={handleChange} />
        <input className="p-2 border rounded" placeholder="Power Status" name="power" value={form.power} onChange={handleChange} />
        <input className="p-2 border rounded" placeholder="Medical Needs" name="medical" value={form.medical} onChange={handleChange} />
        <input className="p-2 border rounded" placeholder="Evacuation Needed (yes/no)" name="evacuation" value={form.evacuation} onChange={handleChange} />
        <input className="p-2 border rounded" placeholder="Nationality *" name="nationality" value={form.nationality} onChange={handleChange} required />

        <div className="md:col-span-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">Submit Registration</button>
        </div>
      </form>

      {entries.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Summary:</h3>
          <p>Total Registrations: <strong>{entries.length}</strong></p>
          <p>Need Evacuation: <strong>{entries.filter(e => e.evacuation?.toLowerCase() === 'yes').length}</strong></p>
          <p>With Medical Needs: <strong>{entries.filter(e => e.medical && e.medical !== '').length}</strong></p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-2">Registered Individuals/Families ({entries.length})</h2>
      <div className="grid gap-3">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No registrations yet. Please fill out the form above.</p>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="border p-3 rounded shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                  <p><strong>Hotel:</strong> {e.hotel}</p>
                  <p><strong>Room:</strong> {e.room}</p>
                  <p><strong>Pax:</strong> {e.pax}</p>
                  <p><strong>Ages:</strong> {e.ages}</p>
                  <p><strong>Baby/Elderly:</strong> {e.babyElderly}</p>
                  <p><strong>Phone:</strong> {e.phone}</p>
                  <p><strong>Supplies:</strong> {e.supplies}</p>
                  <p><strong>Power:</strong> {e.power}</p>
                  <p><strong>Medical:</strong> {e.medical || 'None'}</p>
                  <p><strong>Evacuation:</strong> 
                    <span className={e.evacuation?.toLowerCase() === 'yes' ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {e.evacuation}
                    </span>
                  </p>
                  <p><strong>Nationality:</strong> {e.nationality}</p>
                </div>
                <span className="text-xs text-gray-500">{e.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}