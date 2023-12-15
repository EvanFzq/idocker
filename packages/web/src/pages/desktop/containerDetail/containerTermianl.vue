<template>
  <div class="terminal-box">
    <a-spin v-if="isLoading" />
    <a-empty v-if="isClose">
      <template #description>
        <p>断开链接</p>
        <a-button
          type="primary"
          @click="connect"
        >
          重新链接
        </a-button>
      </template>
    </a-empty>
    <div
      ref="terminalRef"
      style="background-color: #000"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Terminal } from 'xterm';
import 'xterm/lib/xterm.js';
import { CanvasAddon } from 'xterm-addon-canvas';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { io } from 'socket.io-client';
import 'xterm/css/xterm.css';

const props = defineProps<{ id: string }>();

const terminalRef = ref();
const isLoading = ref(true);
const isClose = ref(false);

const connect = () => {
  isLoading.value = true;
  isClose.value = false;
  const socket = io('/container');
  socket.on('connect', () => {
    const terminal = new Terminal({});
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.loadAddon(new SearchAddon());
    terminal.loadAddon(new WebLinksAddon());
    terminal.onData(data => {
      socket.send(data);
    });
    terminal.open(terminalRef.value);
    terminal.focus();
    fitAddon.fit();
    terminal.options.cursorBlink = true;

    window.onresize = function () {
      fitAddon.fit();
    };

    socket.on('data', chunk => {
      isLoading.value = false;
      terminal.write(chunk);
    });
    socket.on('error', () => {
      socket.close();
      terminal.write('\n\r(connection closed)');
      setTimeout(() => {
        terminal.dispose();
      }, 1000);
    });
    socket.on('end', () => {
      socket.close();
      terminal.write('\n\r(connection closed)');
      terminal.dispose();
    });
    terminal.loadAddon(new CanvasAddon());
    socket.emit('terminal', { id: props.id });
  });
  socket.on('disconnect', () => {
    isClose.value = true;
  });
};

onMounted(() => {
  if (terminalRef.value) {
    connect();
  }
});
</script>
<style scoped lang="less">
.terminal-box {
  min-height: calc(100vh - 200px);
}
</style>
