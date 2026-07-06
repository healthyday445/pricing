import { Check, X } from "lucide-react";

const FeaturesTable = () => {
  const features = [
    {
      name: "Daily YOGA",
      year: true,
      sixMonths: true,
      threeMonths: true,
    },
    {
      name: "Daily DIET Routine",
      year: true,
      sixMonths: false,
      threeMonths: false,
    },
    {
      name: "Face Yoga",
      year: true,
      sixMonths: false,
      threeMonths: false,
    },
    {
      name: "Daily Breathwork",
      year: true,
      sixMonths: true,
      threeMonths: false,
    },
    {
      name: "108 Surya Namaskar",
      year: true,
      sixMonths: true,
      threeMonths: false,
    },
    {
      name: "WhatsApp Reminders",
      year: true,
      sixMonths: true,
      threeMonths: true,
    },
    {
      name: "Attendance Tracking",
      year: true,
      sixMonths: true,
      threeMonths: true,
    },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-healthyday-navy mb-8">Overview</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-healthyday-navy font-bold">
                <th className="text-left py-4 px-4 text-gray-400 font-bold uppercase text-xs">FEATURES</th>
                <th className="text-center py-4 px-4 font-bold text-sm">12 MONTHS</th>
                <th className="text-center py-4 px-4 font-bold text-sm">6 MONTHS</th>
                <th className="text-center py-4 px-4 font-bold text-sm">3 MONTHS</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100"
                >
                  <td className="py-4 px-4 text-gray-700 font-medium">{feature.name}</td>
                  <td className="text-center py-4 px-4">
                    {feature.year ? (
                      <Check className="w-6 h-6 text-healthyday-navy mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {feature.sixMonths ? (
                      <Check className="w-6 h-6 text-healthyday-navy mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {feature.threeMonths ? (
                      <Check className="w-6 h-6 text-healthyday-navy mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FeaturesTable;
