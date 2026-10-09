/*
 * Grammatik und Rechtschreibung für Deutsch, Französisch und Englisch mit LanguageTool (offline).
 * Luxemburgisch kann LanguageTool nicht; dafür hunspell.py und nregel.py.
 *
 *   cd scripts/sprache && mvn -q dependency:copy-dependencies -DoutputDirectory=lib
 *   node --experimental-strip-types texte.ts > /tmp/texte.jsonl
 *   java -Dstdout.encoding=UTF-8 -cp "lib/*" LanguageTool.java /tmp/texte.jsonl > /tmp/languagetool.tsv
 *
 * Ausgabe: Sprache, Regel, Schlüssel, Stelle, Meldung, Vorschläge, Text (Tabulator-getrennt).
 */
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.*;
import java.util.*;
import org.languagetool.*;
import org.languagetool.rules.RuleMatch;

public class LanguageTool {
  /** Interne Hinweise, Platzhalter und HTML entfernen, damit nur der sichtbare Satz geprüft wird */
  static String saeubern(String t) {
    return t.replaceAll("\\s*\\[(FEHLT|UNBESTÄTIGT)[^\\]]*\\]", "")
        .replace("{tel}", "95 80 99").replace("{email}", "info@biesen.lu")
        .replaceAll("\\{[^}]*\\}", "X").replaceAll("<[^>]+>", "").replace("­", "")
        .replaceAll("\\s+", " ").trim();
  }

  public static void main(String[] a) throws Exception {
    Map<String, JLanguageTool> lt = Map.of(
        "de", new JLanguageTool(Languages.getLanguageForShortCode("de-DE")),
        "fr", new JLanguageTool(Languages.getLanguageForShortCode("fr")),
        "en", new JLanguageTool(Languages.getLanguageForShortCode("en-GB")));
    ObjectMapper json = new ObjectMapper();
    int n = 0;
    for (String z : Files.readAllLines(Path.of(a[0]))) {
      if (z.isBlank()) continue;
      JsonNode e = json.readTree(z);
      String lang = e.get("lang").asText(), key = e.get("key").asText();
      if (!lt.containsKey(lang) || key.startsWith("slug:")) continue;
      String text = saeubern(e.get("text").asText());
      if (text.isEmpty()) continue;
      for (RuleMatch m : lt.get(lang).check(text)) {
        List<String> v = m.getSuggestedReplacements();
        System.out.println(String.join("\t", lang, m.getRule().getId(), key, "«" + text.substring(m.getFromPos(), m.getToPos()) + "»",
            m.getMessage().replace("\n", " "), String.join(" | ", v.subList(0, Math.min(3, v.size()))), text));
        n++;
      }
    }
    System.err.println("Treffer: " + n);
  }
}
