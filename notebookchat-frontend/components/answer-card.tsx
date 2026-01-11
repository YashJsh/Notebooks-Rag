import { AIAnswerResponse, SourceReference } from "@/api/chat.api";



export function AnswerCard({ data }: { data: AIAnswerResponse }) {
    console.log(data);
    console.log(data.answer);
    return (
      <div className="flex flex-col gap-3">
  
        {/* Answer */}
        <p className="text-foreground text-base tracking-tight">
          {data.answer}
        </p>
  
        <div>
        {
            data.confidence_score && <p className="text-foreground text-center leading-relaxed flex gap-2 justify-start">
            <p className="text-sm"><span className="font-semibold">Confidence  :</span> {data.confidence_score}</p>
        </p>
        }
        
        {/* Source (only if present) */}
        {data.source && <SourceBlock sources={data.source} />}

        {data.notes &&  <p className="text-foreground text-base leading-relaxed">
            <p className="text-sm"><span className="font-semibold">Notes : </span>{data.notes}</p>
        </p>}
        </div>
      </div>
    );
  }
  
function SourceBlock({ sources }: { sources: SourceReference[] }) {
    return (
      <details className="group">
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          View source
        </summary>
  
        <div className="mt-3 space-y-3 rounded-lg bg-muted/40 p-3">
          {sources.map((src, idx) => (
            <div key={idx} className="text-sm">
              <p className="font-medium text-foreground">
                {src.reference}
              </p>
              <p className="text-muted-foreground mt-1 leading-snug">
                “{src.excerpt}”
              </p>
            </div>
          ))}
        </div>
      </details>
    );
  }
  