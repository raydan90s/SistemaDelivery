import { Card, CardContent } from "@components/ui/card";
import { steps } from "@data/steps.data";
export const HowItWorks = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-muted-foreground text-lg">
            Cuatro pasos simples para disfrutar tu comida favorita
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center h-full transition-all duration-300 hover:shadow-card">
                <CardContent className="p-6">
                  <div className="mb-4 relative">
                    <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${step.bgColor}`}>
                      <step.icon className={`h-10 w-10 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>

              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/3 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
