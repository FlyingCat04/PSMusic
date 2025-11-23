namespace PSMusic.Server.Models.DTO.Song
{
    public class SongWithArtistRole : SongDTO
    {
        public string _type = "Main";

        public string Type
        {
            get => _type;
            set
            {
                if (value != "Main" && value != "Collab") throw new ArgumentException("Type của nghệ sĩ cho song phải là 'Main' hoặc 'Collab'");
                _type = value;
            }
        }
    }
}
