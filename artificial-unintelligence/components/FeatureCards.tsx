import { BarChart3, FileText, MessageCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function FeatureCards() {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/15 transition-all duration-300">
                <FileText className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Analyze Company Transcripts</h3>
              <p className="text-slate-300 leading-relaxed">Upload earnings calls and get AI-powered insights</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/15 transition-all duration-300">
                <BarChart3 className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Extract Key Metrics</h3>
              <p className="text-slate-300 leading-relaxed">Get structured financial data and trends</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-coral-500/10 to-teal-500/10 border border-slate-600/50 flex items-center justify-center group-hover:from-coral-500/15 group-hover:to-teal-500/15 transition-all duration-300">
                <MessageCircle className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Interactive Analysis Chat</h3>
              <p className="text-slate-300 leading-relaxed">Ask questions and dive deeper into insights</p>
            </CardContent>
          </Card>
        </div>
  );
}