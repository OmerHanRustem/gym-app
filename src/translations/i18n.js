import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: {
        greeting: "مرحبا, {{name}}!",
        bunyan: "بنيان",
        gymTrainings: "تمارين الصالة",
        date: "التاريخ",
        machine: "الجهاز",
        weight: "الوزن",
        groups: "المجموعات",
        times: "المرات",
        actions: "الإجراءات",
        addTraining: "أضف تمرينا",
        kg: "كغ",
        lb: "رطل",
        edit: "تعديل",
        delete: "حذف",
        editTraining: "تعديل التمرين",
        saveChanges: "حفظ التغييرات",
        close: "إغلاق",
        importToApp: "استيراد ملف",
        exportToCSV: "تصدير CSV",
        changeLang: "اللغة",
        newTraining: "تمرين جديد",
      },
    },
    en: {
      translation: {
        greeting: "Hello, {{name}} !",
        bunyan: "Bunyan",
        gymTrainings: "Gym Trainings",
        date: "Date",
        machine: "Machine",
        weight: "Weight",
        groups: "Groups",
        times: "Times",
        actions: "Actions",
        addTraining: "Add training",
        kg: "kg",
        lb: "lb",
        edit: "Edit",
        delete: "Delete",
        editTraining: "Edit Training",
        saveChanges: "Save Changes",
        close: "Close",
        importToApp: "Import to App",
        exportToCSV: "Export to CSV",
        changeLang: "Language",
        newTraining: "New Training",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  // Set the default language direction to "ltr"
  // The direction will be updated dynamically based on the chosen language
  detection: {
    order: ["querystring", "navigator"],
  },
});

// Add an event listener to detect language changes
i18n.on("languageChanged", (lang) => {
  // Check if the language is Arabic before updating attributes
  if (lang === "ar") {
    // Update the dir and lang attributes on the <html> element
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";

    // Dynamically create and append the <link> element for the CSS file
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css";
    linkElement.integrity =
      "sha384-gXt9imSW0VcJVHezoNQsP+TNrjYXoGcrqBZJpry9zJt8PCQjobwmhMGaDHTASo9N";
    linkElement.crossOrigin = "anonymous";

    // Remove any existing link elements with the same href
    const existingLink = document.querySelector(
      `link[href="${linkElement.href}"]`
    );
    if (existingLink) {
      existingLink.remove();
    }

    // Append the new link element to the head
    document.head.appendChild(linkElement);
  } else {
    // Update the dir and lang attributes on the <html> element
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";

    // Remove the <link> element for the CSS file
    const linkElement = document.querySelector(
      'link[href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css"]'
    );
    if (linkElement) {
      linkElement.remove();
    }
  }
});

export default i18n;
