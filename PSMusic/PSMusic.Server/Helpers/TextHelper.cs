using System.Globalization;
using System.Text;

namespace PSMusic.Server.Helpers
{
    public class TextHelper
    {
        public static string Normalize(string input)
        {
            if (string.IsNullOrEmpty(input)) return string.Empty;

            return new string(input
                .Normalize(NormalizationForm.FormD)
                .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                .ToArray());
        }
    }
}
