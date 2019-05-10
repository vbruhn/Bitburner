export async function main(ns) {
    // Using Port 4 to send a 'sellOnly-signal'
    ns.write(4, "Meh!");
}
