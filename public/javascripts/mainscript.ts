//Importieren des Express-Paketes, was vorher über die package.json als Abhängigkeit angegeben wurde
import * as express from "express";

//Erzeugen des Express-Objekts als fertigen Server
const router: express.Express = express();
//Starten des Servers auf Port 8080 (weil der meist frei ist)
router.listen(8080, () => {
    console.log("Server auf http://localhost:8080/ gestartet");
});

//Die sog. Bodyparser wandeln JSON- (bzw. URLencoded-) Strings in nutzbare Objekte um
router.use(express.json());
router.use(express.urlencoded({extended: false}));

//Aliase für öffentliche Ordner, der eigentliche Pfad / Ordnername wird hinter einer URL versteckt
//Aus der URL localhost:8080/res/images/profil.png wird die Datei ./public/images/profil.png
router.use("/", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));

//Die Startseite als "/" liefert immer per sendFile eine Webseite (HTML-Datei) zurück
router.get("/", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/index.html");
});

//Routen funktionieren wie Eventhandler: Aus einer HTTP-Methode und einer URL wird eine Aktion abgeleitet
router.post("/user", (req: express.Request, res: express.Response) => {
    //Die Parameter in POST und PUT stecken im Request-Body, daher auch req.body.name als Zugriff
    const fname: string = req.body.fname;
    const lname: string = req.body.lname;
    const mail: string = req.body.mail;
    const password: string = req.body.password;

    //Man kann per !== undefined die Existenz der Parameter prüfen
    if (fname !== undefined && lname !== undefined && mail !== undefined && password !== undefined) {
        //Hier müsste man die Daten im Array (oder einer anderen Struktur) abspeichern
        //Dann einen passenden Statuscode wählen
        res.status(201);
        //Den content-type des Responses festlegen
        res.contentType("test/urilist")
        //und eine vernünftige Antwort schicken
        res.send("/user/0")
    } else {
        //Im Fehlerfall kann per sendStatus bequem eine schnellen Antwort geschickt werden
        //Hier: Eines der vier Attribute wurde nicht mitgeschickt
        res.sendStatus(400);
    }
});

//Teile der URL können selbst variabel sein, z.B. /user/0 oder /user/1337
router.get("/user/:id",  (req: express.Request, res: express.Response)=>{
    //Per req.params.name kann auf diesen variablen Teil zugegriffen werden
    const id: number = Number(req.params.id);

    //Wenn die ID, der Arrayindex (oder ggf. der Username) nicht "Not a Number" (NaN) ist (analog zu undefined bei Strings)
    if(!isNaN(id)) {
        //Selektiere den User im Array (hier: nur fiktive Dummydaten)
        const user: any = {"fname":"Manuel", "lname":"Groh", "email":"manuel.groh@mni.thm.de"};
        res.status(200);
        //res.json sendet das Objekt als JSON und passt auch selbst den content-type an
        res.json(user);
    } else {
        //Wenn die ID fehlerhaft ist oder z.B. out of Index-Bounds
        res.sendStatus(400);
    }
});
