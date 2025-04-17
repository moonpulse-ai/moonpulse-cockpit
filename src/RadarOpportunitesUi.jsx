import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

const TG_TOKEN = "7867931896:AAGXjAAG5NbuLIK3AaCvIwnh15KiTaY0j_I";
const TG_CHAT_ID = "-1002591774479";

async function sendToTelegram(op) {
  const message = `🚀 Nouvelle opportunité détectée !\n\n🎯 Nom : ${op.title}\n📊 Plateforme : ${op.platform} (${op.stats})\n💡 Monétisation : ${op.monetization}\n⏳ Fenêtre : ${op.window}\n🔗 Fournisseur : ${op.supplier}\n\n#MoonPulseRadar`;

  const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: message
    })
  });

  if (!response.ok) {
    console.error("Erreur lors de l'envoi Telegram");
  }
}

function RadarOpportunites() {
  const [search, setSearch] = useState("");
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    async function fetchOpportunities() {
      const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.producthunt.com/feed");
      const data = await res.json();

      const items = data.items.slice(0, 10).map((item) => ({
        title: item.title,
        platform: "ProductHunt",
        stats: "Top tendance",
        monetization: item.description.replace(/(<([^>]+)>)/gi, "").slice(0, 100) + "...",
        price: "-",
        supplier: item.link,
        window: "Ajouté récemment"
      }));
      setOpportunities(items);
    }

    fetchOpportunities();
  }, []);

  const filtered = opportunities.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Radar à Opportunités Web</h2>
      <Input
        placeholder="Rechercher une opportunité..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map((op, i) => (
        <Card key={i} className="rounded-2xl shadow-md p-4">
          <CardContent className="space-y-2">
            <div className="font-semibold text-xl">{op.title}</div>
            <div><strong>Plateforme :</strong> {op.platform}</div>
            <div><strong>Stats :</strong> {op.stats}</div>
            <div><strong>Monétisation :</strong> {op.monetization}</div>
            <div><strong>Prix :</strong> {op.price}</div>
            <div><strong>Fournisseur :</strong> <a href={op.supplier} className="text-blue-600 underline" target="_blank">Lien</a></div>
            <div><strong>Fenêtre d'opportunité :</strong> {op.window}</div>
            <Button className="mt-2" onClick={() => sendToTelegram(op)}>📤 Envoyer sur Telegram</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SignauxIA() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Signaux IA simulés</h2>
      <Button className="bg-pink-600">🧠 Générer un signal IA</Button>
      <Button variant="outline">📁 Exporter CSV</Button>
      {/* Ajoute ici le tableau ou journal des signaux IA si besoin */}
    </div>
  );
}

export default function MoonPulseTabs() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🌙 MoonPulse Cockpit</h1>
      <Tabs defaultValue="signals">
        <TabsList>
          <TabsTrigger value="signals">📈 Signaux IA</TabsTrigger>
          <TabsTrigger value="radar">🌐 Radar Opportunités</TabsTrigger>
        </TabsList>

        <TabsContent value="signals">
          <SignauxIA />
        </TabsContent>
        <TabsContent value="radar">
          <RadarOpportunites />
        </TabsContent>
      </Tabs>
    </div>
  );
}
