<template>
  <main class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">Support informatique</p>
        <h1>Tickets de maintenance</h1>
        <p class="intro">Consultez les incidents déclarés par les utilisateurs.</p>
      </div>
      <div class="header-mark" aria-hidden="true">TM</div>
    </header>

    <nav class="main-nav" aria-label="Navigation principale">
      <RouterLink to="/tickets">Liste des tickets</RouterLink>
      <RouterLink to="/tickets/nouveau">Nouveau ticket</RouterLink>
    </nav>

    <RouterView />
  </main>
</template>
